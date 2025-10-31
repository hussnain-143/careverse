import React from "react";

const LoginPage = React.lazy(() => import("../components/login/main"));

export default function LoginWrapper() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
        </React.Suspense>
    );
} 