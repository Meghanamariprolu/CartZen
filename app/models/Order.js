import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            productId: Number,
            name: String,
            price: Number,
            quantity: Number,
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Success' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
