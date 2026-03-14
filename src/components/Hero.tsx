import TechIcon from './TechIcon';

const TECH_PILLS = ['Databricks', 'Azure', 'AWS', 'Terraform', 'Kubernetes', 'Airflow', 'Unity Catalog', 'Python'];

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

      {/* ── Left: content ── */}
      <div className="relative z-10 flex w-full flex-1">
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-12 lg:px-16 py-32">

        {/* Subtitle */}
        <div className="animate-fade-in-up-delay-1 mb-2">
          <span className="text-gray-400 text-sm font-medium tracking-widest uppercase">
            Senior Data Platform Engineer · Data Architect
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
          <p>
            <span className="text-gray-800 font-semibold">Data enthusiast and Data &amp; AI Platform Leader</span> specializing in Databricks Lakehouse architecture
            and cloud-native engineering. With extensive experience building scalable data platforms across
            finance, retail, and logistics, I combine the best of <span className="text-gray-800 font-semibold">software, data, and DevOps engineering</span>.
            I have a proven track record of delivering impact across Azure, AWS, and GCP.
            When I'm not building data platforms, you'll find me on the tennis court, out on a run, or pushing weights at the gym.
          </p>
        </div>



      </div>

        {/* ── Right: photo ── */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <div className="w-[28rem] h-[28rem] xl:w-[34rem] xl:h-[34rem] rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
            <img
              src="/ramu-portfolio/photo.jpg"
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
            href="/ramu-portfolio/RamuKamath-CV.pdf"
            download="RamuKamath-CV.pdf"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm text-gray-700 border border-gray-200 hover:border-[#d97757] hover:text-[#d97757] transition-all duration-200 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
            </svg>
            Download CV
          </a>
          <a
            href="mailto:ramukamath@outlook.com"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #d97757 0%, #c2622a 100%)', boxShadow: '0 4px 20px rgba(217,119,87,0.25)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </a>
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">-- Tech Stack</p>
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
