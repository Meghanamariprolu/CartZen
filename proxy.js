import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
        error: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET || "cartzen-mock-secret-key-12345",
});

export const config = {
    matcher: [
        "/",
        "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|.*\\.(?:jpg|jpeg|gif|png|svg|webp)).*)",
    ],
};
