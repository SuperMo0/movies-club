import { useState, type FormEvent } from 'react';
import { NavLink } from 'react-router';
import { Handshake, Mail, MessageCircle, Send, Users } from 'lucide-react';
import InfoPage, { InfoCard } from '@/components/layout/info-page';
import { CONTACT_EMAIL } from '@/utils/site-info';

const topics = ['General question', 'Cinema partnership', 'Report a problem', 'Account & privacy'];

const fieldClass = 'h-12 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 text-sm text-white placeholder:text-slate-600 outline-none transition-colors focus:border-slate-500 focus:ring-2 focus:ring-white/10';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', topic: topics[0]!, message: '' });
    const [error, setError] = useState('');

    // Opens the visitor's email app with the message filled in, addressed to us.
    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!form.message.trim()) return setError('Write a message so we know how to help.');
        setError('');
        const body = `${form.message.trim()}\n\n— ${form.name.trim() || 'A MovieClub visitor'}`;
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[MovieClub] ${form.topic}`)}&body=${encodeURIComponent(body)}`;
    }

    return (
        <InfoPage eyebrow="Contact" title="Get in touch" intro="Questions, feedback or a problem with the site? We read every message.">
            <div className="grid gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                <InfoCard>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div className="space-y-1.5">
                            <label htmlFor="contact-name" className="text-xs font-medium text-slate-400">Your name</label>
                            <input id="contact-name" autoComplete="name" className={fieldClass} placeholder="Optional"
                                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="contact-topic" className="text-xs font-medium text-slate-400">Topic</label>
                            <select id="contact-topic" className={fieldClass} value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}>
                                {topics.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="contact-message" className="text-xs font-medium text-slate-400">Message</label>
                            <textarea id="contact-message" rows={5} placeholder="How can we help?"
                                className={`${fieldClass} h-auto resize-none py-3 ${error ? 'border-red-500/80' : ''}`}
                                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                            {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
                        </div>
                        <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 sm:w-auto">
                            <Send className="size-4" /> Send message
                        </button>
                        <p className="text-xs text-slate-500">This opens your email app with your message ready to send.</p>
                    </form>
                </InfoCard>

                <div className="space-y-4">
                    <InfoCard>
                        <Mail className="mb-3 size-5 text-red-500" />
                        <h2 className="font-bold text-white">Email</h2>
                        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block text-sm break-all text-slate-300 hover:text-white">{CONTACT_EMAIL}</a>
                    </InfoCard>
                    <InfoCard>
                        <Handshake className="mb-3 size-5 text-red-500" />
                        <h2 className="font-bold text-white">Run a cinema?</h2>
                        <p className="mt-1 text-sm text-slate-400">See how MovieClub can sell your tickets.</p>
                        <NavLink to="/partners" className="mt-2 inline-block text-sm font-semibold text-red-400 hover:text-red-300">Partner with us →</NavLink>
                    </InfoCard>
                    <InfoCard>
                        <div className="mb-3 flex gap-2 text-red-500"><MessageCircle className="size-5" /><Users className="size-5" /></div>
                        <h2 className="font-bold text-white">Meet the team</h2>
                        <NavLink to="/join" className="mt-2 inline-block text-sm font-semibold text-red-400 hover:text-red-300">Join us →</NavLink>
                    </InfoCard>
                </div>
            </div>
        </InfoPage>
    );
}
