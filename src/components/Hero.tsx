import { useEffect, useState } from 'react';
import TechIcon from './TechIcon';

const TECH_PILLS = ['Databricks', 'Azure', 'AWS', 'Terraform', 'Kubernetes', 'Airflow', 'Unity Catalog', 'Python'];

// Segments: { text, bold }
const SEGMENTS = [
  { text: 'Data enthusiast and Data & AI Platform Leader specializing', bold: true },
  { text: ' in Databricks Lakehouse architecture and cloud-native engineering. With extensive experience building scalable data platforms across finance, retail, and logistics, I combine the best of ', bold: false },
  { text: 'software, data, and DevOps engineering', bold: true },
  { text: ". I have a proven track record of delivering impact across Azure, AWS, and GCP. When I'm not building data platforms, you'll find me on the tennis court, out on a run, or pushing weights at the gym.", bold: false },
];

const FULL_TEXT = SEGMENTS.map(s => s.text).join('');

function TypewriterText() {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (charCount >= FULL_TEXT.length) return;
    const timeout = setTimeout(() => setCharCount(c => c + 1), 30);
    return () => clearTimeout(timeout);
  }, [charCount]);

  let globalIndex = 0;
  const rendered = SEGMENTS.map((seg, si) => {
    const visible = seg.text.slice(0, Math.max(0, charCount - globalIndex));
    globalIndex += seg.text.length;
    if (!visible) return null;
    return seg.bold
      ? <span key={si} className="text-gray-800 font-semibold">{visible}</span>
      : <span key={si}>{visible}</span>;
  });

  return (
    <span>
      {rendered}
      {charCount < FULL_TEXT.length && (
        <span className="inline-block w-2.5 h-4 bg-black ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

export default function Hero() {

  return (
    <section id="about" className="relative min-h-screen flex flex-col overflow-hidden bg-white">

      {/* ── Subtle orbs ── */}
      <div className="orb-1 absolute top-[-10%] left-[30%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at 40% 40%, rgba(217,119,87,0.08) 0%, transparent 70%)' }} />
      <div className="orb-2 absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at 60% 60%, rgba(217,119,87,0.06) 0%, transparent 72%)' }} />

      {/* ── Subtle grid ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }} />

      {/* ── Main content row ── */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full flex-1">

        {/* Photo: top on mobile, hidden on desktop (shown on right) */}
        <div className="flex lg:hidden justify-center pt-28 pb-6 px-8">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
            <img
              src="/photo.jpg"
              alt="Ramu Kamath"
              className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-110"
              style={{ objectPosition: 'center top' }}
            />
          </div>
        </div>

        {/* Left: text content */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-12 lg:px-16 pb-16 lg:py-32">

          {/* Subtitle */}
          <div className="animate-fade-in-up-delay-1 mb-2">
            <span className="text-gray-400 text-sm font-medium tracking-widest uppercase">
              Senior Data Platform Engineer · Data Architect · Vibe Coder 🤖
            </span>
          </div>

          {/* Big headline */}
          <h1 className="word-animate text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.05]"
            style={{ animationDelay: '0.2s' }}>
            Ramu<br />
            <span style={{ color: '#d97757' }}>Kamath</span>
          </h1>

          {/* Bio */}
          <div className="animate-fade-in-up-delay-2 text-gray-500 text-base leading-relaxed max-w-lg mb-8">
            <p><TypewriterText /></p>
          </div>
        </div>

        {/* Right: photo on desktop */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <div className="w-[28rem] h-[28rem] xl:w-[34rem] xl:h-[34rem] rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
            <img
              src="/photo.jpg"
              alt="Ramu Kamath"
              className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-110"
              style={{ objectPosition: 'center top' }}
            />
          </div>
        </div>
      </div>

      {/* ── Tech pills at bottom ── */}
      <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 py-8 border-t border-gray-100">
        <div className="flex flex-wrap gap-3 mb-10">
          <a
            href={`/RamuKamath-CV.pdf?v=${Date.now()}`}
            download="RamuKamath-CV.pdf"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm text-gray-700 border border-gray-200 hover:border-[#d97757] hover:text-[#d97757] transition-all duration-200 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
            </svg>
            Download CV
          </a>
          <a
            href="mailto:contact@ramukamath.com"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #d97757 0%, #c2622a 100%)', boxShadow: '0 4px 20px rgba(217,119,87,0.25)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </a>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#d97757]" />
          <span className="text-[#d97757] font-semibold text-sm uppercase tracking-wider">Tech Stack</span>
        </div>
        <div className="flex flex-wrap gap-3">
        {TECH_PILLS.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-full border border-gray-200 text-gray-600 hover:border-[#d97757] hover:text-[#d97757] transition-colors duration-200 cursor-default"
          >
            <TechIcon name={tech} size={20} />
            {tech}
          </span>
        ))}
        </div>
      </div>
    </section>
  );
}
