import { useState } from 'react';

const testimonials = [
  {
    name: 'Maarten Kalff',
    title: 'Technology and organization consultancy',
    relationship: 'Managed Ramu directly · October 2020',
    quote: 'I loved working with Ramu. He is skilled, and a quick learner when something new pops up. Ramu is tidy and has attention to detail yet still is a fast worker. As a colleague, Ramu is an absolute delight. He a true team player, one of these people who really make the team more than the sum of the parts. A really nice guy whom I was always happy to see in the morning.',
    photo: '/maarten.png',
  },
  {
    name: 'Diena Mahran',
    title: 'Freelance Data Architect | Solution Architect | Data Governance | Certified Data Trainer',
    relationship: 'Worked with Ramu in the same group · July 2022',
    quote: 'Ramu is an eager and highly skilled data engineer who goes out of his way to deliver above expectations. He always updates his experience with the newest technologies. He keeps an eye on solutions and developments in the market to implement at his clients. This is also the reason why he rapidly developed to the lead engineer in his team and is known by the business, PO\'s and data modellers as the go to person when it comes to developing data platforms.\n\nRamu is not only a highly skilled engineer, but also a friendly and genuine colleague who is concerned about the development of his team members and a healthy atmosphere within his team. His energy and participation always leaves an unforgettable impression.',
    photo: '/diena.png',
  },
  {
    name: 'Shanker Somanchi',
    title: 'Business Intelligence Consultant',
    relationship: 'Worked with Ramu on different teams · November 2018',
    quote: 'I know Ramu when working together in KPN. Ramu is very efficient and intellectual thus always has very good thoughts to a problem or to build a solution. Besides my experience is his general nature of not giving up is quiet often seen in professional work. He is fun to talk to and it makes connecting to him and working with him lot easier. I really recommend Ramu to be a colleague.',
    photo: '/shanker.png',
  },
];

const CHAR_LIMIT = 300;

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = t.quote.length > CHAR_LIMIT;
  const displayQuote = isLong && !expanded ? t.quote.slice(0, CHAR_LIMIT).trimEnd() + '…' : t.quote;

  return (
    <div className="rounded-2xl p-8 flex flex-col gap-6" style={{ background: '#eae5dc' }}>
      {/* Quote mark */}
      <svg className="w-8 h-8 opacity-30" fill="#1a1a1a" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.293-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.293-3.996 5.849h3.983v10h-9.983z"/>
      </svg>

      {/* Quote */}
      <div className="flex-1">
        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
          {displayQuote}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm font-medium text-[#d97757] hover:text-[#c2622a] transition-colors duration-200"
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}
      </div>

      {/* Author */}
      <div className="border-t border-black/10 pt-5 flex items-center gap-4">
        {t.photo ? (
          <img src={t.photo} alt={t.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {t.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900 text-sm">{t.name}</p>
          <p className="text-gray-500 text-xs">{t.title}</p>
          <p className="text-gray-400 text-xs mt-0.5">{t.relationship}</p>
        </div>
        <div className="ml-auto">
          <svg className="w-5 h-5 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#d97757]" />
            <span className="text-[#d97757] font-semibold text-sm uppercase tracking-wider">Recommendations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What colleagues say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
