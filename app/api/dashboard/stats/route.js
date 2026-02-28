import dbConnect from '@/lib/mongodb';
import Order from "@/models/Order";
import User from "@/models/User";
import Message from "@/models/Message";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();

        // 1. Total Sales & Orders
        const orders = await Order.find({});
        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const orderCount = orders.length;

        // 2. Active Users
        const userCount = await User.countDocuments();

        // 3. Conversations (Messages)
        const messageCount = await Message.countDocuments();

        // 4. Monthly Growth (Simplified logic: compare this month's revenue to last month's)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const thisMonthOrders = await Order.find({ createdAt: { $gte: startOfMonth } });
        const lastMonthOrders = await Order.find({ createdAt: { $gte: lastMonthStart, $lt: startOfMonth } });

        const thisMonthRevenue = thisMonthOrders.reduce((acc, o) => acc + o.totalAmount, 0);
        const lastMonthRevenue = lastMonthOrders.reduce((acc, o) => acc + o.totalAmount, 0);

        let growth = 0;
        if (lastMonthRevenue > 0) {
            growth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else if (thisMonthRevenue > 0) {
            growth = 100; // 100% growth if there was no revenue last month
        }

        // 5. Recent Activity (Placeholder for real data)
        const recentActivity = [
            { name: 'Apple iPhone 13', cat: 'Smartphones', stock: 3, loss: '$2,400' },
            { name: 'Essence Mascara', cat: 'Beauty', stock: 1, loss: '$45' },
            { name: 'Nike Shield shoes', cat: 'Footwear', stock: 4, loss: '$480' },
            { name: 'Samsung Galaxy S21', cat: 'Smartphones', stock: 2, loss: '$1,600' },
        ];

        return NextResponse.json({
            stats: [
                { label: 'Total Sales', value: `$${totalSales.toLocaleString()}`, change: growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`, isUp: growth >= 0, icon: 'dollar' },
                { label: 'Orders', value: orderCount.toLocaleString(), change: '+0%', isUp: true, icon: 'bag' },
                { label: 'Conversations', value: messageCount.toLocaleString(), change: '+0%', isUp: true, icon: 'chat' },
                { label: 'Active Users', value: userCount.toLocaleString(), change: '+0%', isUp: true, icon: 'people' },
            ],
            revenueGrowth: [30, 45, 35, 60, 55, 80, 75, 90, 85, 100, 95, 110], // Simulated chart data for now
            recentActivity
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
