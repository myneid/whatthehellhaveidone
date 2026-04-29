import { Head, router, usePage } from '@inertiajs/react';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/auth';

type InvitationData = {
    token: string;
    email: string;
    role: string;
    project: { id: number; name: string; description: string | null };
    inviter: { id: number; name: string };
    expires_at: string;
};

type Props = {
    invitation: InvitationData;
    auth?: { user?: User };
};

export default function AcceptInvitation({ invitation }: Props) {
    const { props } = usePage<{ auth?: { user?: User } }>();
    const user = props.auth?.user;

    function accept() {
        router.post(`/invitations/${invitation.token}/accept`);
    }

    return (
        <>
            <Head title={`Join ${invitation.project.name}`} />

            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm text-center space-y-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <UserCheck className="h-7 w-7 text-primary" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold">You've been invited</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            <strong>{invitation.inviter.name}</strong> has invited you to join{' '}
                            <strong>{invitation.project.name}</strong> as a <strong>{invitation.role}</strong>.
                        </p>
                        {invitation.project.description && (
                            <p className="mt-2 text-sm text-muted-foreground">{invitation.project.description}</p>
                        )}
                    </div>

                    {user ? (
                        user.email.toLowerCase() === invitation.email.toLowerCase() ? (
                            <Button className="w-full" onClick={accept}>
                                Accept Invitation
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-destructive">
                                    This invitation was sent to <strong>{invitation.email}</strong>.
                                    You're signed in as <strong>{user.email}</strong>.
                                </p>
                                <Button variant="outline" className="w-full" asChild>
                                    <a href="/login">Sign in with the invited account</a>
                                </Button>
                            </div>
                        )
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Sign in or create an account to join this project.
                            </p>
                            <Button className="w-full" asChild>
                                <a href={`/invitations/${invitation.token}/accept?continue=login`}>Sign In</a>
                            </Button>
                            <Button variant="outline" className="w-full" asChild>
                                <a href={`/invitations/${invitation.token}/accept?continue=register`}>
                                    Create Account
                                </a>
                            </Button>
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        Invitation expires {new Date(invitation.expires_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </>
    );
}
