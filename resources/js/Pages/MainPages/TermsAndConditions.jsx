import { Head, Link } from '@inertiajs/react';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import GuestLayout from '@/Layouts/GuestLayout';

const sections = [
    {
        title: '1. Acceptance of Terms',
        content:
            'By accessing or using the Inscriptions of Nepal website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use this website.',
    },
    {
        title: '2. Purpose of the Website',
        content:
            'This website provides access to information, research material, and digital resources relating to the inscriptions and written heritage of Nepal. The content is made available for educational, research, and non-commercial personal use unless otherwise stated.',
    },
    {
        title: '3. Intellectual Property',
        content:
            'All website content, including text, images, records, designs, and other materials, is protected by applicable intellectual-property laws. You may not reproduce, distribute, modify, or use this material for commercial purposes without prior written permission from the relevant rights holder.',
    },
    {
        title: '4. Responsible Use',
        content:
            'You agree to use the website lawfully and respectfully. You must not attempt to interfere with the website’s operation, gain unauthorised access to its systems, or use its content in a way that could harm the project, its contributors, or other users.',
    },
    {
        title: '5. Accuracy of Information',
        content:
            'We aim to keep the information on this website accurate and current. However, historical research and cataloguing may be updated over time, and we do not guarantee that all content is complete, error-free, or suitable for every purpose.',
    },
    {
        title: '6. External Links',
        content:
            'This website may include links to third-party websites for reference or convenience. We are not responsible for the content, availability, or privacy practices of those external websites.',
    },
    {
        title: '7. Changes to These Terms',
        content:
            'We may revise these Terms and Conditions when necessary. Any changes will take effect when they are posted on this page. Your continued use of the website after changes are published means that you accept the revised terms.',
    },
];

const TermsAndConditions = () => {
    return (
        <>
            <Head title="Terms and Conditions" />

            <main className="px-4 pb-16 pt-32 sm:px-6 md:pt-36 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="border-l-4 border-[#7b634c] pl-5 sm:pl-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7b634c]">
                            Inscriptions of Nepal
                        </p>
                        <h1 className="mt-3 text-3xl font-bold text-[#282118] sm:text-4xl">
                            Terms and Conditions
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-[#5c554d]">
                            Please read these terms carefully before using our website and its resources.
                        </p>
                    </div>

                    <section className="mt-10 rounded-2xl border border-[#ded8ce] bg-white p-6 shadow-sm sm:p-10">
                        <div className="space-y-8">
                            {sections.map(({ title, content }) => (
                                <article key={title}>
                                    <h2 className="text-xl font-semibold text-[#47574a]">{title}</h2>
                                    <p className="mt-3 text-base leading-7 text-[#5c554d]">{content}</p>
                                </article>
                            ))}

                            <article>
                                <h2 className="text-xl font-semibold text-[#47574a]">8. Contact Us</h2>
                                <p className="mt-3 text-base leading-7 text-[#5c554d]">
                                    If you have questions about these Terms and Conditions, please contact us at{' '}
                                    <a
                                        href="mailto:info@nepalinscription.com"
                                        className="font-medium text-[#7b634c] underline decoration-[#b7a999] underline-offset-4 hover:text-[#5d4938]"
                                    >
                                        info@nepalinscription.com
                                    </a>
                                    .
                                </p>
                            </article>
                        </div>
                    </section>

                    {/* <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl bg-[#47574a] px-6 py-5 text-white sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <FiMail className="shrink-0 text-xl" aria-hidden="true" />
                            <p className="text-sm leading-6">Questions about these terms? We are here to help.</p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#47574a] transition-colors hover:bg-[#efefe8] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#47574a]"
                        >
                            <FiArrowLeft aria-hidden="true" />
                            Back to home
                        </Link>
                    </div> */}
                </div>
            </main>
        </>
    );
};

TermsAndConditions.layout = (page) => <GuestLayout>{page}</GuestLayout>;

export default TermsAndConditions;
