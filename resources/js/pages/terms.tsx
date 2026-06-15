import { Head, Link } from '@inertiajs/react';

export default function Terms() {
    return (
        <>
            <Head title="Terms of Service" />
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
                            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
                            <p className="mt-2 text-sm text-white/30">Last updated: June 15, 2026</p>
                        </div>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">1. Acceptance of Terms</h2>
                            <p className="leading-relaxed">
                                By accessing or using this application, you agree to be bound by these Terms of Service. If you do not
                                agree, you may not use the application.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">2. Disclaimer of Liability</h2>
                            <p className="leading-relaxed">
                                The application is provided <strong className="text-white">"as is"</strong>, without warranty of any kind.
                                In no event shall the developers or owners be liable for any damages arising out of the use or inability to
                                use the application.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">3. Data Loss</h2>
                            <p className="leading-relaxed">
                                You are solely responsible for maintaining backups of any data you create or store. We are not responsible
                                for any loss or corruption of data, including losses resulting from server failures, database errors, or
                                user error.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">4. Acceptable Use</h2>
                            <p className="leading-relaxed">You may not use this application to:</p>
                            <ul className="mt-2 list-inside list-disc space-y-1">
                                <li>Violate any applicable law or regulation.</li>
                                <li>Attempt to gain unauthorised access to any part of the system.</li>
                                <li>Transmit malicious code or interfere with the application's operation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="mb-3 text-lg font-semibold text-white">5. Governing Law</h2>
                            <p className="leading-relaxed">
                                These terms are governed by the laws of the jurisdiction in which the application is hosted, without
                                regard to conflict of law principles.
                            </p>
                        </section>
                    </article>
                </div>
            </div>
        </>
    );
}
