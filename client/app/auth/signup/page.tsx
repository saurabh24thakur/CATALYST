import { redirect } from 'next/navigation';

// Old NextAuth route — redirect to Clerk sign-up
export default function OldSignUpRedirect() {
    redirect('/sign-up');
}
