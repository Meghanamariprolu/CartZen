import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '@/lib/mock-db';

export async function POST(req) {
    try {
        console.log('Register API: Received request');
        const { name, email, password } = await req.json();
        console.log('Register API: Parsed body for', email);

        if (!name || !email || !password) {
            console.log('Register API: Missing fields');
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        // Check if user already exists
        console.log('Register API: Checking for existing user');
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            console.log('Register API: User already exists');
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash password
        console.log('Register API: Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log('Register API: Password hashed');

        // Create user in Mock DB
        console.log('Register API: Creating user in mock DB');
        const newUser = await createUser({
            name,
            email,
            password: hashedPassword,
        });
        console.log('Register API: User created with ID', newUser.id);

        return NextResponse.json({ message: 'User created successfully (Mock)', user: { id: newUser.id, name, email } }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
