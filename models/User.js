import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // Optional for users who sign up via OAuth (Google/GitHub)
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
    },
    savedAddresses: [AddressSchema],
    provider: {
        type: String,
        default: 'credentials'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
