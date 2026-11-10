import Subscription from '../models/subscriptionSchema.js';
import DemoTransaction from '../models/demoTransactionSchema.js';
import AiUsage from '../models/aiUsageSchema.js';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans.js';

export const getCurrentSubscription = async (userId) => {
    const now = new Date();
    const current = await Subscription.findOne({ userId, plan: 'premium', status: 'active' })
        .sort({ expiresAt: -1 });

    if (current && current.expiresAt && current.expiresAt <= now) {
        current.status = 'expired';
        await current.save();
    }

    const active = current && current.status === 'active' ? current : null;
    if (active) return active;

    const freeSubscription = await Subscription.findOneAndUpdate(
        { userId, plan: 'free' },
        { $setOnInsert: { userId, plan: 'free', status: 'active', startedAt: now } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return freeSubscription;
};

export const getPlanEntitlements = async (userId) => {
    const subscription = await getCurrentSubscription(userId);
    const premium = subscription.plan === 'premium' && subscription.status === 'active';
    const plan = SUBSCRIPTION_PLANS[premium ? 'premium' : 'free'];
    const period = new Date().toISOString().slice(0, 7);
    const usage = await AiUsage.findOne({ userId, period }).select('count').lean();

    return {
        subscription,
        plan,
        isPremium: premium,
        aiUsage: usage?.count || 0,
        period,
    };
};

export const getSubscriptionSnapshot = async (userId) => {
    const entitlements = await getPlanEntitlements(userId);
    const transactions = await DemoTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    return {
        subscription: entitlements.subscription,
        plan: entitlements.plan,
        isPremium: entitlements.isPremium,
        usage: {
            aiAnalysesUsed: entitlements.aiUsage,
            aiAnalysesLimit: entitlements.plan.monthlyAiLimit,
            resumesLimit: entitlements.plan.resumeLimit,
            period: entitlements.period,
        },
        transactions,
    };
};

export const claimFreeAiAnalysis = async (userId, limit, period = new Date().toISOString().slice(0, 7)) => {
    const query = { userId, period, count: { $lt: limit } };
    const claimed = await AiUsage.findOneAndUpdate(query, { $inc: { count: 1 } }, { new: true });
    if (claimed) return claimed.count;

    try {
        const created = await AiUsage.create({ userId, period, count: 1 });
        return created.count;
    } catch (error) {
        if (error.code !== 11000) throw error;
        const retried = await AiUsage.findOneAndUpdate(query, { $inc: { count: 1 } }, { new: true });
        if (retried) return retried.count;
        return null;
    }
};

export const releaseFreeAiAnalysis = async (userId, period) => {
    await AiUsage.updateOne(
        { userId, period, count: { $gt: 0 } },
        { $inc: { count: -1 } }
    );
};
