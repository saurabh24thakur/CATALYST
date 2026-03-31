import { redirect } from 'next/navigation';

// Old NextAuth route — redirect to Clerk sign-in
export default function OldSignInRedirect() {
    redirect('/sign-in');
}
