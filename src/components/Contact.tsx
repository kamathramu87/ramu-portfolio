export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Section Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#d97757]" />
            <span className="text-[#d97757] font-semibold text-sm uppercase tracking-wider">Contact</span>
            <div className="h-px w-8 bg-[#d97757]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Let's Work Together</h2>
          <p className="text-gray-500 text-lg mb-12 leading-relaxed">
            I'm always open to discussing data platform challenges, architecture reviews,
            or new opportunities. Feel free to reach out.
          </p>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: 'Email',
                value: 'ramukamath@outlook.com',
                href: 'mailto:ramukamath@outlook.com',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                label: 'Phone',
                value: '+31 630 212 429',
                href: 'tel:+31630212429',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
                label: 'LinkedIn',
                value: 'ramu-kamathb5b40499',
                href: 'https://www.linkedin.com/in/ramu-k-b5b40499',
              },
            ].map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-500 group-hover:text-[#d97757] group-hover:shadow-md transition-all duration-200 mb-3 shadow-sm">
                  {contact.icon}
                </div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{contact.label}</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-[#c2622a] transition-colors duration-200 text-center">
                  {contact.value}
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
