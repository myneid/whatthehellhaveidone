import { Link } from '@inertiajs/react';

export default function Privacy() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4 prose dark:prose-invert">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">← Back</Link>
            <h1>Privacy Policy</h1>
            <p>Last Updated: June 15, 2026</p>
            
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you use our application, such as:</p>
            <ul>
                <li>Account information (email, name, etc.)</li>
                <li>Content you create or upload (boards, cards, work logs, attachments)</li>
                <li>Usage data (how you interact with the application)</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Provide, maintain, and improve the application.</li>
                <li>Authenticate your identity and secure your account.</li>
                <li>Facilitate collaboration and project management features.</li>
                <li>Communicate with you regarding your account or application updates.</li>
            </ul>

            <h2>3. Data Storage and Security</h2>
            <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.</p>

            <h2>4. Third-Party Services</h2>
            <p>We may use third-party services (such as cloud hosting providers) to facilitate our service. These third parties may have access to your information only to perform specific tasks on our behalf.</p>

            <h2>5. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your information.</p>

            <h2>6. Changes to This Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

            <h2>7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through the application.</p>
        </div>
    );
}
