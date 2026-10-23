import { NavLink } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Armchair, CalendarClock, Handshake, MessageSquareText, Send, Ticket } from 'lucide-react';
import InfoPage, { InfoCard } from '@/components/layout/info-page';
import { GETTodayCinemas } from '@/api/movies.api';
import { CONTACT_EMAIL } from '@/utils/site-info';

const benefits = [
    {
        Icon: CalendarClock,
        title: 'Your showtimes, always current',
        text: 'Showtimes sync every day, so movie-goers searching by cinema, film or date always see your latest schedule.',
    },
    {
        Icon: Armchair,
        title: 'Seat selection built in',
        text: 'Guests pick a showtime, choose their exact seats on your hall layout, standard, premium or wheelchair, and continue to checkout.',
    },
    {
        Icon: Ticket,
        title: 'Online checkout',
        text: 'A secure card checkout with prices in EGP, ready to connect to your ticketing and payment systems.',
    },
    {
        Icon: MessageSquareText,
        title: 'A community that talks about your films',
        text: 'Ratings, posts and discussions keep audiences coming back, and trending movies show what people want to see next.',
    },
];

export default function PartnersPage() {
    const { data } = useQuery({ queryKey: ['cinemas'], queryFn: GETTodayCinemas, staleTime: Infinity });
    const cinemaCount = data ? Object.keys(data.cinemas).length : null;

    return (
        <InfoPage
            eyebrow="Partners"
            title="Sell more tickets with MovieClub"
            intro={<>
                MovieClub is where movie-goers in Egypt check what's showing, pick a seat and talk about films.
                {cinemaCount ? <> Showtimes from <span className="font-semibold text-white">{cinemaCount} cinemas</span> are listed today.</> : null}
            </>}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map(({ Icon, title, text }) => (
                    <InfoCard key={title}>
                        <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-red-600/10 text-red-500"><Icon className="size-5" /></div>
                        <h2 className="font-bold text-white">{title}</h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{text}</p>
                    </InfoCard>
                ))}
            </div>

            <InfoCard className="mt-6">
                <div className="flex items-center gap-3">
                    <Handshake className="size-5 text-red-500" />
                    <h2 className="text-lg font-bold text-white">How it works</h2>
                </div>
                <ol className="mt-4 space-y-3 text-sm text-slate-300">
                    {[
                        'We talk through your cinemas, halls and how you sell tickets today.',
                        'We connect MovieClub to your ticketing system so seats and prices stay in sync.',
                        'Your showtimes go live with seat selection and checkout on MovieClub.',
                    ].map((step, i) => (
                        <li key={step} className="flex gap-3">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">{i + 1}</span>
                            <span className="pt-0.5">{step}</span>
                        </li>
                    ))}
                </ol>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Cinema partnership')}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
                    >
                        <Send className="size-4" /> Become a partner
                    </a>
                    <NavLink to="/" className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500">
                        See it in action
                    </NavLink>
                </div>
            </InfoCard>
        </InfoPage>
    );
}
