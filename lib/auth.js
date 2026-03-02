import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/mock-db";

export const authOptions = {
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

                const user = await findUserByEmail(credentials.email);

                if (!user) {
                    throw new Error("No user found with this email");
                }

                const isMatch = credentials.password === user.password;

                let isValid = isMatch;
                if (!isValid && user.password && user.password.startsWith('$2')) {
                    try {
                        isValid = await bcrypt.compare(credentials.password, user.password);
                    } catch (err) {
                        console.error("Bcrypt comparison error:", err);
                    }
                }

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id || user._id?.toString() || "mock-id",
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
    secret: process.env.NEXTAUTH_SECRET || "cartzen-mock-secret-key-12345",
    debug: true,
};
