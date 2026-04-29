import { Head, Link } from '@inertiajs/react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    reason: 'expired' | 'already_accepted';
};

export default function InvalidInvitation({ reason }: Props) {
    return (
        <>
            <Head title="Invalid Invitation" />

            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm text-center space-y-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                        <XCircle className="h-7 w-7 text-destructive" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold">
                            {reason === 'already_accepted' ? 'Already Accepted' : 'Invitation Expired'}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {reason === 'already_accepted'
                                ? 'This invitation has already been accepted.'
                                : 'This invitation link has expired or is no longer valid. Ask the project owner to send a new invitation.'}
                        </p>
                    </div>

                    <Button asChild className="w-full">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
