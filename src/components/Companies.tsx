const companies = [
  { name: 'ABN AMRO', logo: '/abnamro.png' },
  { name: 'FedEx', logo: '/fedex.png' },
  { name: 'NN Investment Partners', logo: '/nnip.png' },
];

// Duplicate for seamless loop
const ITEMS = [...companies, ...companies];

export default function Companies() {
  return (
    <section className="py-10 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center">
          Companies I've worked with
        </p>
      </div>

      {/* Marquee */}
      <div className="relative flex">
        <div className="flex items-center gap-20 animate-marquee whitespace-nowrap" style={{ willChange: 'transform' }}>
          {ITEMS.map((company, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <img src={company.logo} alt={company.name} className="h-16 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
