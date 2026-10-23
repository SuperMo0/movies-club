import type { ReactNode } from 'react';
import InfoPage from '@/components/layout/info-page';
import { CONTACT_EMAIL } from '@/utils/site-info';

const sections: { title: string, body: ReactNode }[] = [
    {
        title: 'What we collect',
        body: (
            <ul className="list-disc space-y-1.5 pl-5">
                <li><span className="text-slate-200">Your account:</span> name, username and password. Passwords are stored only as a secure hash, never in plain text.</li>
                <li><span className="text-slate-200">Your profile:</span> the bio and profile picture you choose to add.</li>
                <li><span className="text-slate-200">What you post:</span> posts, ratings, photos, comments, likes and who you follow.</li>
                <li><span className="text-slate-200">Technical logs:</span> our hosting provider keeps short-lived logs, such as IP address and pages requested, to keep the service running and secure.</li>
            </ul>
        ),
    },
    {
        title: 'Payment cards',
        body: 'Card details you enter at checkout are never stored by MovieClub and are not sent to our servers.',
    },
    {
        title: "What's public",
        body: 'Your name, username, bio, profile picture, posts, ratings and comments are visible to everyone who visits MovieClub, including people without an account. Your password and login session are never shown.',
    },
    {
        title: 'Cookies',
        body: 'We use a single cookie to keep you logged in. It can only be read by our server and expires after two days. We do not use advertising or tracking cookies, and we do not run analytics.',
    },
    {
        title: 'Services we rely on',
        body: (
            <ul className="list-disc space-y-1.5 pl-5">
                <li><span className="text-slate-200">Heroku</span> hosts the website.</li>
                <li><span className="text-slate-200">Supabase</span> hosts our database.</li>
                <li><span className="text-slate-200">Cloudinary</span> stores the photos you upload.</li>
                <li>Movie posters and showtimes come from public cinema listings and are shown as published.</li>
            </ul>
        ),
    },
    {
        title: 'Your choices',
        body: <>You can edit your profile at any time. To delete your account and everything you've posted, or to ask what we hold about you, email <a href={`mailto:${CONTACT_EMAIL}`} className="text-red-400 hover:text-red-300">{CONTACT_EMAIL}</a> and we'll take care of it.</>,
    },
    {
        title: 'We never sell your data',
        body: "We don't sell or rent your personal information, and we only share it with the services above so MovieClub can work.",
    },
];

export default function PrivacyPage() {
    return (
        <InfoPage eyebrow="Privacy" title="Privacy policy" intro="What MovieClub collects, why, and the choices you have. Last updated 23 October 2026.">
            <div className="space-y-8">
                {sections.map(({ title, body }) => (
                    <section key={title}>
                        <h2 className="mb-2 text-lg font-bold text-white">{title}</h2>
                        <div className="leading-relaxed text-slate-400">{body}</div>
                    </section>
                ))}
            </div>
        </InfoPage>
    );
}
