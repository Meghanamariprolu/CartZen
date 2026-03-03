/**
 * MOCK DATABASE UTILITY
 * ---------------------
 * This file replaces MongoDB/Mongoose models with local data.
 * In a real production app, this would be a real database, but for 
 * deployment stability on free tiers (like Vercel), we use this mock layer.
 */

// 1. Initial Mock Users
// 1. Initial Mock Users
const INITIAL_USERS = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        image: null,
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

// 2. Initial Mock Orders (for historical data)
const INITIAL_ORDERS = [
    { id: 'ORD001', userId: '2', totalAmount: 1250, status: 'delivered', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)) },
    { id: 'ORD002', userId: '1', totalAmount: 450, status: 'shipped', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
    { id: 'ORD003', userId: '2', totalAmount: 890, status: 'pending', createdAt: new Date() },
    { id: 'ORD004', userId: '1', totalAmount: 2100, status: 'delivered', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
];

// --- DATABASE SIMULATORS ---

// In-Memory Storage with Global Persistence (Next.js Hot Reload Fix)
/**
 * In Next.js development mode, modules are often re-loaded.
 * Using a global variable ensures that our mock data persists across
 * file saves and hot-reloads.
 */
if (!global._mock_users) {
    global._mock_users = [...INITIAL_USERS];
}
if (!global._mock_messages) {
    global._mock_messages = [];
}
if (!global._mock_orders) {
    global._mock_orders = [...INITIAL_ORDERS];
}

let users = global._mock_users;
let messages = global._mock_messages;
let orders = global._mock_orders;

/**
 * USER HELPERS
 */
export const findUserByEmail = async (email) => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const createUser = async (userData) => {
    console.log('MockDB: Creating user...', userData.email);
    const newUser = {
        id: (users.length + 1).toString(),
        ...userData,
        role: 'user',
        createdAt: new Date()
    };
    users.push(newUser);
    console.log('MockDB: User created! Current user count:', users.length);
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
 * ORDER HELPERS
 */
export const createOrder = async (orderData) => {
    const newOrder = {
        id: `ORD${Math.floor(Math.random() * 900000) + 100000}`,
        ...orderData,
        createdAt: new Date()
    };
    orders.push(newOrder);
    return newOrder;
};

/**
 * DASHBOARD HELPERS
 */
export const getDashboardStats = async () => {
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const orderCount = orders.length;
    const userCount = users.length;

    // Revenue Growth (Mock monthly grouping for simplicity)
    const months = Array(12).fill(0);
    orders.forEach(order => {
        const month = new Date(order.createdAt).getMonth();
        months[month] += order.totalAmount / 10; // Scaled for chart visualization
    });

    return {
        stats: [
            { label: 'Total Sales', value: `$${totalSales.toLocaleString()}`, change: '+12.5%', isUp: true, icon: 'dollar' },
            { label: 'Orders', value: orderCount.toString(), change: '+5.2%', isUp: true, icon: 'bag' },
            { label: 'Conversations', value: messages.length.toString(), change: '+0%', isUp: true, icon: 'chat' },
            { label: 'Active Users', value: userCount.toString(), change: '+2.1%', isUp: true, icon: 'people' },
        ],
        revenueGrowth: months,
        recentActivity: [
            { name: 'Apple iPhone 15 Pro', cat: 'Smartphones', stock: 12, loss: '$12,000' },
            { name: 'Sony WH-1000XM5', cat: 'Accessories', stock: 8, loss: '$3,200' },
            { name: 'MacBook Air M3', cat: 'Laptops', stock: 5, loss: '$6,500' },
            { name: 'Nike Air Max 270', cat: 'Footwear', stock: 15, loss: '$2,250' },
        ]
    };
};

/**
 * CONTACT HELPERS
 */
export const saveMessage = async (msgData) => {
    const newMsg = { id: Date.now(), ...msgData, createdAt: new Date() };
    messages.push(newMsg);
    return newMsg;
};

// Default Export
const MockDB = {
    findUserByEmail,
    createUser,
    updateUserProfile,
    createOrder,
    getDashboardStats,
    saveMessage
};

export default MockDB;
