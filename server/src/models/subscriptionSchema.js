import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    plan: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
        required: true,
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: null,
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active',
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: null,
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DemoTransaction',
        default: null,
    },
}, { timestamps: true });

subscriptionSchema.index({ userId: 1, createdAt: -1 });
subscriptionSchema.index(
    { transactionId: 1 },
    { unique: true, partialFilterExpression: { transactionId: { $type: 'objectId' } } }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
