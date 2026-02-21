import mongoose from 'mongoose';

const ARAssetSchema = new mongoose.Schema({
    productId: {
        type: String, // Can be ID from external API or local
        required: true,
        index: true
    },
    platform: {
        type: String,
        enum: ['web', 'ios', 'android'],
        default: 'web'
    },
    tryOnType: {
        type: String,
        enum: ['glasses', 'makeup', 'clothing', 'none'],
        required: true
    },
    files: {
        gltf: String,
        usdz: String, // For iOS AR Quick Look
        textures: [String],
        maskAlpha: String
    },
    adjustmentMeta: {
        initialScale: { type: Number, default: 1 },
        anchorPoint: { type: String, default: 'center' },
        rotationOffset: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            z: { type: Number, default: 0 }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.ARAsset || mongoose.model('ARAsset', ARAssetSchema);
