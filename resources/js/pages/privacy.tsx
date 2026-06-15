import { Head, Link } from '@inertiajs/react';

export default function Privacy() {
    return (
        <>
            <Head title="Privacy Policy" />
            <div
                className="min-h-screen"
                style={{
                    background: 'linear-gradient(135deg, #0a0a0f 0%, #12101a 50%, #0f0a14 100%)',
                    fontFamily: "'Instrument Sans', sans-serif",
                }}
            >
                <div className="mx-auto max-w-3xl px-6 py-12">
                    <Link
                        href="/"
                        className="mb-10 inline-flex items-center gap-1 text-sm text-white/40 transition-colors hover:text-white/70"
                    >
                        ← Back to home
                    </Link>

                    <article className="mt-8 space-y-8 text-white/70">
                        <div>
                            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
                            <p className="mt-2 text-sm text-white/30">Last updated: June 15, 2026</p>
                        </div>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">1. Information We Collect</h2>
                            <p className="leading-relaxed">We collect information you provide when using the application:</p>
                            <ul className="mt-2 list-inside list-disc space-y-1">
                                <li>Account details (name, email address)</li>
                                <li>Content you create (boards, cards, work logs, documents)</li>
                                <li>Connected integrations (GitHub accounts, tokens)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">2. How We Use Your Information</h2>
                            <ul className="list-inside list-disc space-y-1">
                                <li>To provide and maintain the application.</li>
                                <li>To authenticate your identity and secure your account.</li>
                                <li>To enable collaboration and project management features.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">3. Data Storage and Security</h2>
                            <p className="leading-relaxed">
                                We implement standard security measures to protect your data. No method of electronic storage is 100%
                                secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">4. Third-Party Services</h2>
                            <p className="leading-relaxed">
                                We may use third-party services such as cloud hosting providers. These parties access your data only to
                                perform tasks on our behalf and are obligated not to disclose or use it for other purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">5. Your Rights</h2>
                            <p className="leading-relaxed">
                                You may request access to, correction of, or deletion of your personal data at any time by contacting us
                                through the application.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">6. Changes to This Policy</h2>
                            <p className="leading-relaxed">
                                We may update this policy from time to time. Changes will be posted on this page with an updated date.
                            </p>
                        </section>
                    </article>
                </div>
            </div>
        </>
    );
}
