export const SUBSCRIPTION_PLANS = {
    free: {
        id: 'free',
        name: 'Free',
        monthlyPrice: 0,
        yearlyPrice: 0,
        resumeLimit: 2,
        monthlyAiLimit: 3,
        templates: ['classic'],
        features: [
            'Create up to 2 resumes',
            '3 AI resume analyses each month',
            'Classic ATS-friendly template',
            'Save and download resumes',
        ],
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        monthlyPrice: 99,
        yearlyPrice: 499,
        resumeLimit: null,
        monthlyAiLimit: null,
        templates: ['classic', 'modern', 'compact'],
        features: [
            'Unlimited resume creation',
            'Unlimited AI resume analysis',
            'Full AI resume rewrite drafts',
            'All premium ATS-friendly templates',
        ],
    },
};

export const DEMO_BILLING_CYCLES = ['monthly', 'yearly'];

export const getPlanPrice = (planId, billingCycle) => {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan || !DEMO_BILLING_CYCLES.includes(billingCycle)) return null;
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
};

export const getExpirationDate = (startDate, billingCycle) => {
    const startedAt = new Date(startDate);
    const year = startedAt.getFullYear() + (billingCycle === 'yearly' ? 1 : 0);
    const month = startedAt.getMonth() + (billingCycle === 'yearly' ? 0 : 1);
    const targetYear = year + Math.floor(month / 12);
    const targetMonth = month % 12;
    const finalDay = new Date(targetYear, targetMonth + 1, 0).getDate();
    return new Date(
        targetYear,
        targetMonth,
        Math.min(startedAt.getDate(), finalDay),
        startedAt.getHours(),
        startedAt.getMinutes(),
        startedAt.getSeconds(),
        startedAt.getMilliseconds()
    );
};
