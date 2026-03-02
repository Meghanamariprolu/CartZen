import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
        error: "/login" // Redirect to login on error
    },
});

export const config = {
    matcher: [
        "/",
        "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|.*\\.(?:jpg|jpeg|gif|png|svg|webp)).*)",
    ],
};
