<x-mail::message>
# You're invited to {{ $projectName }}

{{ $inviterName }} has invited you to collaborate on **{{ $projectName }}** on What the HELL have I done.

<x-mail::button :url="$acceptUrl">
Accept Invitation
</x-mail::button>

This invitation expires on **{{ $expiresAt }}**.

If you weren't expecting this invitation, you can safely ignore this email.

Thanks,
{{ config('app.name') }}
</x-mail::message>
