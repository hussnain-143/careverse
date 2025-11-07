import React from "react";
import Loading from "../loading";
const RegisterPage = React.lazy(() => import("../components/register/main"));

export default function LoginWrapper() {
    return (
        <React.Suspense fallback={<div><Loading/></div>}>
            <RegisterPage />
        </React.Suspense>
    );
} 