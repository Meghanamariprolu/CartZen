import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/mock-db";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "me@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("NextAuth: Mock Authorize for", credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter an email and password");
                }

                // Use Mock DB instead of Mongoose
                const user = await findUserByEmail(credentials.email);

                if (!user) {
                    throw new Error("No user found with this email");
                }

                // For mock demo, we support plain text password match if not bcrypt-ed
                // In this mock, we'll try a simple match first
                const isMatch = credentials.password === user.password;

                // Fallback to bcrypt if it's a real hashed password in mock
                let isValid = isMatch;
                if (!isValid && user.password.startsWith('$2a$')) {
                    isValid = await bcrypt.compare(credentials.password, user.password);
                }

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role || 'user'
                };
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_GOOGLE_ID",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_GOOGLE_SECRET",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "MOCK_GITHUB_ID",
            clientSecret: process.env.GITHUB_SECRET || "MOCK_GITHUB_SECRET",
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development' || true, // Force true for debugging on Vercel
});

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production') {
    console.error("CRITICAL: NEXTAUTH_SECRET is not defined in production!");
}

export { handler as GET, handler as POST };
