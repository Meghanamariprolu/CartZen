/**
 * MOCK DATABASE UTILITY
 * ---------------------
 * This file replaces MongoDB/Mongoose models with local data.
 * In a real production app, this would be a real database, but for 
 * deployment stability on free tiers (like Vercel), we use this mock layer.
 */

// 1. Initial Mock Users
const INITIAL_USERS = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        image: null, // Removed existing profile picture
        phone: '9876543210'
    },
    {
        id: '2',
        name: 'Demo Customer',
        email: 'user@test.com',
        password: 'password123',
        role: 'user',
        image: null,
        phone: '1234567890'
    }
];

// 2. Mock Dashboard Stats
const MOCK_STATS = {
    stats: [
        { label: 'Total Sales', value: '$124,592', change: '+18.2%', isUp: true, icon: 'dollar' },
        { label: 'Orders', value: '3,842', change: '+12.5%', isUp: true, icon: 'bag' },
        { label: 'Conversations', value: '1,248', change: '+4.3%', isUp: true, icon: 'chat' },
        { label: 'Active Users', value: '42,109', change: '+9.1%', isUp: true, icon: 'people' },
    ],
    revenueGrowth: [65, 78, 92, 110, 105, 130, 145, 160, 155, 180, 175, 210],
    recentActivity: [
        { name: 'Apple iPhone 15 Pro', cat: 'Smartphones', stock: 12, loss: '$12,000' },
        { name: 'Sony WH-1000XM5', cat: 'Accessories', stock: 8, loss: '$3,200' },
        { name: 'MacBook Air M3', cat: 'Laptops', stock: 5, loss: '$6,500' },
        { name: 'Nike Air Max 270', cat: 'Footwear', stock: 15, loss: '$2,250' },
    ]
};

// --- DATABASE SIMULATORS ---

// In-Memory Storage (will reset on server restart)
let users = [...INITIAL_USERS];
let messages = [];
let orders = [];

/**
 * USER HELPERS
 */
export const findUserByEmail = async (email) => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const createUser = async (userData) => {
    const newUser = {
        id: (users.length + 1).toString(),
        ...userData,
        role: 'user', // Default Role
        createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
};

export const updateUserProfile = async (email, updates) => {
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        return users[index];
    }
    return null;
};

/**
 * DASHBOARD HELPERS
 */
export const getDashboardStats = async () => {
    return MOCK_STATS;
};

/**
 * CONTACT HELPERS
 */
export const saveMessage = async (msgData) => {
    const newMsg = { id: Date.now(), ...msgData, createdAt: new Date() };
    messages.push(newMsg);
    console.log('Mock DB: Message Saved', newMsg);
    return newMsg;
};

// Default Export
const MockDB = {
    findUserByEmail,
    createUser,
    updateUserProfile,
    getDashboardStats,
    saveMessage
};

export default MockDB;
