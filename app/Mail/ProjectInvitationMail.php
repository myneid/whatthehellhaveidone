<?php

namespace App\Mail;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProjectInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Invitation $invitation) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "You've been invited to join {$this->invitation->project->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.invitation',
            with: [
                'acceptUrl' => url("/invitations/{$this->invitation->token}/accept"),
                'projectName' => $this->invitation->project->name,
                'inviterName' => $this->invitation->invitedBy->name,
                'expiresAt' => $this->invitation->expires_at->toFormattedDateString(),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
