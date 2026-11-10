import crypto from 'node:crypto';
import Subscription from '../models/subscriptionSchema.js';
import DemoTransaction from '../models/demoTransactionSchema.js';
import {
    DEMO_BILLING_CYCLES,
    getExpirationDate,
    getPlanPrice,
    SUBSCRIPTION_PLANS,
} from '../config/subscriptionPlans.js';
import { getCurrentSubscription, getSubscriptionSnapshot } from '../services/subscriptionService.js';

export const getSubscriptionPlans = (req, res) =>
    res.json({
        demoOnly: true,
        currency: 'INR',
        plans: Object.values(SUBSCRIPTION_PLANS),
        billingCycles: DEMO_BILLING_CYCLES,
    });

export const getMySubscription = async (req, res) => {
    try {
        return res.json(await getSubscriptionSnapshot(req.userId));
    } catch (error) {
        console.error('Could not load subscription:', error.message);
        return res.status(500).json({ message: 'Unable to load subscription details.' });
    }
};

export const createDemoCheckout = async (req, res) => {
    const { plan, billingCycle } = req.body || {};
    if (plan !== 'premium' || !DEMO_BILLING_CYCLES.includes(billingCycle)) {
        return res.status(400).json({ message: 'Choose a valid premium billing option.' });
    }

    try {
        const amount = getPlanPrice(plan, billingCycle);
        const transactionId = `DEMO-${crypto.randomUUID()}`;
        const transaction = await DemoTransaction.create({
            transactionId,
            userId: req.userId,
            plan,
            billingCycle,
            amount,
            currency: 'INR',
            paymentMethod: 'DEMO',
            status: 'pending',
        });

        return res.status(201).json({
            transaction: {
                transactionId: transaction.transactionId,
                plan: transaction.plan,
                billingCycle: transaction.billingCycle,
                amount: transaction.amount,
                currency: transaction.currency,
                status: transaction.status,
                paymentMethod: transaction.paymentMethod,
                createdAt: transaction.createdAt,
            },
            message: 'Demo checkout created. No real payment will be collected.',
        });
    } catch (error) {
        console.error('Could not create demo checkout:', error.message);
        return res.status(500).json({ message: 'Unable to start demo checkout.' });
    }
};

export const completeDemoCheckout = async (req, res) => {
    const { outcome } = req.body || {};
    if (!['success', 'failed'].includes(outcome)) {
        return res.status(400).json({ message: 'Choose a demo payment success or failure result.' });
    }

    let processingTransactionId;
    try {
        const transaction = await DemoTransaction.findOne({
            transactionId: req.params.transactionId,
            userId: req.userId,
        });
        if (!transaction) return res.status(404).json({ message: 'Demo transaction not found.' });

        const processingTimeout = new Date(Date.now() - 2 * 60 * 1000);
        if (transaction.status === 'processing' && transaction.updatedAt <= processingTimeout) {
            const resetTransaction = await DemoTransaction.findOneAndUpdate(
                {
                    _id: transaction._id,
                    status: 'processing',
                    updatedAt: transaction.updatedAt,
                },
                { $set: { status: 'pending' } },
                { new: true }
            );
            if (!resetTransaction) {
                return res.status(409).json({ message: 'This demo transaction is still being verified.' });
            }
            transaction.status = 'pending';
        }

        if (transaction.status !== 'pending') {
            if (transaction.status !== outcome) {
                if (transaction.status === 'processing') {
                    return res.status(409).json({ message: 'This demo transaction is already being verified.' });
                }
                return res.status(409).json({ message: 'This demo transaction has already been completed.' });
            }
            const snapshot = await getSubscriptionSnapshot(req.userId);
            return res.json({ transaction, subscription: snapshot.subscription, plan: snapshot.plan, isPremium: snapshot.isPremium });
        }

        const expectedAmount = getPlanPrice(transaction.plan, transaction.billingCycle);
        if (
            transaction.paymentMethod !== 'DEMO' ||
            transaction.currency !== 'INR' ||
            !expectedAmount ||
            transaction.amount !== expectedAmount
        ) {
            return res.status(400).json({ message: 'Demo transaction details failed server verification.' });
        }

        if (outcome === 'failed') {
            const failedTransaction = await DemoTransaction.findOneAndUpdate(
                { _id: transaction._id, status: 'pending' },
                { $set: { status: 'failed' } },
                { new: true }
            );
            if (!failedTransaction) {
                return res.status(409).json({ message: 'This demo transaction has already been completed.' });
            }
            const snapshot = await getSubscriptionSnapshot(req.userId);
            return res.json({
                transaction: failedTransaction,
                subscription: snapshot.subscription,
                plan: snapshot.plan,
                isPremium: snapshot.isPremium,
                message: 'Demo payment failed. No subscription was activated.',
            });
        }

        const processingTransaction = await DemoTransaction.findOneAndUpdate(
            { _id: transaction._id, status: 'pending' },
            { $set: { status: 'processing' } },
            { new: true }
        );
        if (!processingTransaction) {
            return res.status(409).json({ message: 'This demo transaction has already been completed.' });
        }
        processingTransactionId = transaction._id;

        const current = await Subscription.findOne({
            userId: req.userId,
            plan: 'premium',
            status: 'active',
            expiresAt: { $gt: new Date() },
        }).sort({ expiresAt: -1 });
        const startedAt = new Date();
        const effectiveStart = current?.expiresAt > startedAt ? current.expiresAt : startedAt;
        const expiresAt = getExpirationDate(effectiveStart, transaction.billingCycle);

        const subscription = await Subscription.findOneAndUpdate(
            { transactionId: transaction._id },
            {
                $setOnInsert: {
                    userId: req.userId,
                    plan: 'premium',
                    billingCycle: transaction.billingCycle,
                    status: 'active',
                    startedAt: effectiveStart,
                    expiresAt,
                    transactionId: transaction._id,
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        const completedTransaction = await DemoTransaction.findOneAndUpdate(
            { _id: transaction._id, userId: req.userId, status: 'processing' },
            { $set: { status: 'success', subscriptionId: subscription._id } },
            { new: true }
        );
        if (!completedTransaction) {
            return res.status(409).json({ message: 'Demo subscription could not be activated. Retry transaction status.' });
        }

        return res.json({
            transaction: completedTransaction,
            subscription,
            plan: SUBSCRIPTION_PLANS.premium,
            isPremium: true,
            message: 'Demo payment verified by the server. Premium is now active.',
        });
    } catch (error) {
        if (processingTransactionId) {
            try {
                await DemoTransaction.updateOne(
                    { _id: processingTransactionId, status: 'processing' },
                    { $set: { status: 'pending' } }
                );
            } catch (resetError) {
                console.error('Could not reset interrupted demo transaction:', resetError.message);
            }
        }
        console.error('Could not complete demo checkout:', error.message);
        return res.status(500).json({ message: 'Unable to verify demo transaction.' });
    }
};
