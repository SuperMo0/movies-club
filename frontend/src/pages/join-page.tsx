import { useState } from 'react';
import { Code2, Github, Globe, GraduationCap, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import InfoPage, { InfoCard } from '@/components/layout/info-page';
import { CONTACT_EMAIL, FOUNDER } from '@/utils/site-info';

const links = [
    { label: 'LinkedIn', href: FOUNDER.links.linkedin, Icon: Linkedin },
    { label: 'GitHub', href: FOUNDER.links.github, Icon: Github },
    { label: 'Codeforces', href: FOUNDER.links.codeforces, Icon: Code2 },
    { label: 'Portfolio', href: FOUNDER.links.portfolio, Icon: Globe },
];

export default function JoinPage() {
    const [photoFailed, setPhotoFailed] = useState(false);

    return (
        <InfoPage
            eyebrow="Join us"
            title="The team behind MovieClub"
            intro="MovieClub brings showtimes from cinemas across Egypt into one place, with a community to rate and talk about what you watched."
        >
            <InfoCard className="overflow-hidden p-0 md:p-0">
                <div className="h-24 bg-linear-to-r from-red-700/50 via-red-600/20 to-transparent md:h-28" />
                <div className="-mt-12 px-5 pb-6 md:px-8 md:pb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        {photoFailed
                            ? <div className="flex size-24 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-bold text-white ring-4 ring-slate-950">{FOUNDER.initials}</div>
                            : <img src={FOUNDER.avatar} alt={FOUNDER.name} onError={() => setPhotoFailed(true)} className="size-24 rounded-2xl object-cover ring-4 ring-slate-950" />}
                        <div className="flex flex-wrap gap-2">
                            {links.map(({ label, href, Icon }) => (
                                <a
                                    key={label} href={href} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-red-500 hover:text-white"
                                >
                                    <Icon className="size-4" /> {label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <h2 className="mt-5 text-2xl font-bold text-white">{FOUNDER.name}</h2>
                    <p className="font-medium text-red-400">{FOUNDER.role}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="size-3.5" /> {FOUNDER.location}</p>

                    <p className="mt-5 leading-relaxed text-slate-300">{FOUNDER.bio}</p>

                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                        {FOUNDER.highlights.map(item => (
                            <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                                <GraduationCap className="mt-0.5 size-4 shrink-0 text-slate-600" /> {item}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:gap-6">
                        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white">
                            <Mail className="size-4 text-slate-500" /> {CONTACT_EMAIL}
                        </a>
                        <a href={FOUNDER.phone.href} className="inline-flex items-center gap-2 text-sm text-slate-300 tabular-nums transition-colors hover:text-white">
                            <Phone className="size-4 text-slate-500" /> {FOUNDER.phone.display}
                        </a>
                    </div>
                </div>
            </InfoCard>

            <InfoCard className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-white">Want to build MovieClub with us?</h2>
                    <p className="mt-1 max-w-lg text-sm text-slate-400">
                        We're a small team and always happy to hear from engineers, designers and people who know the cinema business.
                        Tell us a bit about yourself and what you'd like to work on.
                    </p>
                </div>
                <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Joining MovieClub')}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
                >
                    <Send className="size-4" /> Get in touch
                </a>
            </InfoCard>
        </InfoPage>
    );
}
