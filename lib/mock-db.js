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
        password: 'password123', // In a real app, this would be hashed
        role: 'admin',
        image: 'https://i.pravatar.cc/150?u=admin',
        phone: '9876543210'
    },
    {
        id: '2',
        name: 'Demo Customer',
        email: 'user@test.com',
        password: 'password123',
        role: 'user',
        image: 'https://i.pravatar.cc/150?u=user',
        phone: '1234567890'
    }
];

// 2. Mock Dashboard Stats
const MOCK_STATS = {
    stats: [
        { label: 'Total Sales', value: '$45,231', change: '+12.5%', isUp: true, icon: 'dollar' },
        { label: 'Orders', value: '1,284', change: '+3.2%', isUp: true, icon: 'bag' },
        { label: 'Conversations', value: '842', change: '-1.4%', isUp: false, icon: 'chat' },
        { label: 'Active Users', value: '12,402', change: '+5.7%', isUp: true, icon: 'people' },
    ],
    revenueGrowth: [40, 55, 45, 70, 65, 90, 85, 100, 95, 110, 105, 120],
    recentActivity: [
        { name: 'Apple iPhone 15', cat: 'Smartphones', stock: 2, loss: '$1,800' },
        { name: 'Floral Summer Dress', cat: 'Women', stock: 1, loss: '$85' },
        { name: 'Levi\'s 501 Jeans', cat: 'Men', stock: 4, loss: '$240' },
        { name: 'AirPods Pro', cat: 'Gadgets', stock: 0, loss: '$249' },
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
