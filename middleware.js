import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
        error: "/login" // Redirect to login on error
    },
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (allow authentication API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (login page)
         * - register (register page)
         * - any image assets (.jpg, .jpeg, .png, .svg, .webp)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|clear_cookies|.*\\.(?:jpg|jpeg|gif|png|svg|webp)).*)",
    ],
};
