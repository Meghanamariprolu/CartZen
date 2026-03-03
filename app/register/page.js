'use client';

import React from 'react';
import LoginPage from '../login/page';

/**
 * RegisterPage
 * Reuses the LoginPage component but defaults to registration mode.
 * The LoginPage component in app/login/page.js is built to handle both.
 */
export default function RegisterPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            {/* We can't pass props to a default exported component easily if it's not designed for it,
                but the LoginPage state is internal. However, we can wrap it or modify it. 
                Actually, the LoginPage is exported as default. Let's check if we can pass a prop.
            */}
            <LoginPage defaultIsLogin={false} />
        </React.Suspense>
    );
}
