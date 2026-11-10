import mongoose from 'mongoose';

const demoTransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    plan: {
        type: String,
        enum: ['premium'],
        required: true,
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        enum: ['INR'],
        default: 'INR',
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'success', 'failed'],
        default: 'pending',
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['DEMO'],
        default: 'DEMO',
        required: true,
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null,
    },
}, { timestamps: true });

demoTransactionSchema.index({ userId: 1, createdAt: -1 });

const DemoTransaction = mongoose.model('DemoTransaction', demoTransactionSchema);
export default DemoTransaction;
