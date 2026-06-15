import { Link } from '@inertiajs/react';
import { Layout } from '@/components/layout'; // Assuming a layout component exists or I'll use AppShell/standard layout

export default function Terms() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4 prose dark:prose-invert">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">← Back</Link>
            <h1>Terms and Conditions</h1>
            <p>Last Updated: June 15, 2026</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using our application, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

            <h2>2. Disclaimer of Liability</h2>
            <p><strong>THE APPLICATION IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</strong></p>
            <p>In no event shall the developers, owners, or affiliates of this application be liable for any damages (including, without limitation, direct, indirect, incidental, consequential, or punitive damages) arising out of the use or inability to use the application, even if advised of the possibility of such damages.</p>

            <p><strong>DATA LOSS DISCLAIMER:</strong></p>
            <p>You acknowledge that you are solely responsible for maintaining backups of any data you create, upload, or store within the application. We do not guarantee the permanence or availability of any data. We are not responsible for any loss of data, corruption of data, or any other loss resulting from the use of the application, including but not limited to server failures, database errors, or user error.</p>

            <h2>3. Use License</h2>
            <p>Permission is granted to temporarily use the application for personal, non-commercial transitory or educational purposes.</p>

            <h2>4. Limitations</h2>
            <p>The licenses granted in this agreement do not permit you to:</p>
            <ul>
                <li>Modify or copy the materials in the application.</li>
                <li>Use the application for any commercial purpose.</li>
                <li>Attempt to decompile or reverse engineer any software component.</li>
            </ul>

            <h2>5. Governing Law</h2>
            <p>These terms are governed by and construed in accordance with the laws of the jurisdiction in which the application is hosted, without regard to its conflict of law principles.</p>
        </div>
    );
}
