import mongoose from 'mongoose';

const aiUsageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    period: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        default: 0,
        min: 0,
    },
}, { timestamps: true });

aiUsageSchema.index({ userId: 1, period: 1 }, { unique: true });

const AiUsage = mongoose.model('AiUsage', aiUsageSchema);
export default AiUsage;
