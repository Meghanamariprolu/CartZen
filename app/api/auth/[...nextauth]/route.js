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

                // For mock demo, we support plain text password match first
                const isMatch = credentials.password === user.password;

                // Fallback to bcrypt if it's a real hashed password in mock
                // Bcrypt hashes can start with $2a$, $2b$, or $2y$
                let isValid = isMatch;
                if (!isValid && user.password && user.password.startsWith('$2')) {
                    try {
                        isValid = await bcrypt.compare(credentials.password, user.password);
                    } catch (err) {
                        console.error("Bcrypt comparison error:", err);
                    }
                }

                if (!isValid) {
                    console.error("NextAuth: Invalid credentials for", credentials.email);
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id || user._id?.toString() || "mock-id", // handle both formats
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
    // CRITICAL: NextAuth requires a secret in production.
    // If process.env.NEXTAUTH_SECRET is missing, we provide a fallback for this mock-mode.
    secret: process.env.NEXTAUTH_SECRET || "cartzen-mock-secret-key-12345",
    debug: true,
});

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production') {
    console.warn("WARNING: NEXTAUTH_SECRET is not defined in production. Using fallback secret for MockDB mode.");
}

export { handler as GET, handler as POST };
