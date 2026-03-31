export const runtime = 'edge';

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-transparent">
            <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/analyze" />
        </div>
    );
}
