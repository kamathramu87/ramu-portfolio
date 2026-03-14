import { useState } from 'react';
import { experiences } from '../data/experience';

export default function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="experience" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#d97757]" />
            <span className="text-[#d97757] font-semibold text-sm uppercase tracking-wider">Career</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Experience</h2>
          <p className="text-gray-500 max-w-2xl">
            15+ years of building data platforms at leading financial institutions across Europe and Asia.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {experiences.map((exp) => {
            const isOpen = expandedId === exp.id;
            return (
              <div
                key={exp.id}
                className="flex flex-col rounded-2xl p-7 transition-all duration-200"
                style={{ background: '#eae5dc' }}
              >
                {/* Company & role */}
                <div className="flex-1 mb-6">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      {exp.company}
                    </h3>
                    {exp.id === '1' && (
                      <span
                        className="mt-1 flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                        style={{ background: '#d97757' }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-base">{exp.role}</p>
                </div>

                {/* Metadata rows */}
                <div className="border-t border-black/10 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-black/10">
                    <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Period</span>
                    <span className="text-sm text-gray-800 font-medium">{exp.period}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black/10">
                    <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Location</span>
                    <span className="text-sm text-gray-800 text-right max-w-[55%]">{exp.location}</span>
                  </div>
                  {exp.type && (
                    <div className="flex justify-between items-center py-3 border-b border-black/10">
                      <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Type</span>
                      <span className="text-sm text-gray-800">{exp.type}</span>
                    </div>
                  )}
                </div>

                {/* Expandable bullet points */}
                {isOpen && (
                  <ul className="space-y-2 mb-6">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                    {/* Tags */}
                    <li className="flex flex-wrap gap-1.5 pt-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 text-xs font-medium rounded-full border border-black/15 text-gray-600"
                          style={{ background: 'rgba(0,0,0,0.05)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </li>
                  </ul>
                )}

                {/* CTA button */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : exp.id)}
                  className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{ background: '#1a1a1a' }}
                >
                  <span>{isOpen ? 'Hide details' : 'View details'}</span>
                  <span
                    className="transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
                  >
                    →
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
