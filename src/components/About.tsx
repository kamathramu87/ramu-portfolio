export default function About() {

  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          {/* Text Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#d97757]" />
              <span className="text-[#d97757] font-semibold text-sm uppercase tracking-wider">About Me</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Building the data platforms that power modern finance
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                I'm a Senior Data Platform Engineer and Data Architect with over 15 years of experience
                designing and building enterprise-scale data infrastructure at major financial institutions
                across Europe.
              </p>
              <p>
                Currently at <span className="font-semibold text-gray-900">ABN AMRO Bank</span> in Amsterdam,
                I lead the architecture of their next-generation Data & AI platform built on Databricks lakehouse
                on Azure — delivering unified data governance through Unity Catalog, infrastructure-as-code with
                Terraform, and scalable orchestration via Airflow on AKS.
              </p>
              <p>
                My expertise spans the full data engineering spectrum: from designing medallion architectures
                and data quality frameworks to FinOps optimization and CI/CD automation. I've worked across
                Azure, AWS, and GCP, and hold <span className="font-semibold text-gray-900">11 professional certifications</span> across
                all three major cloud providers.
              </p>
              <p>
                I'm passionate about bridging the gap between engineering excellence and business value —
                whether that's through a 30% cost reduction via cloud migration, a CLI tool that saves hours
                of manual config work, or a governance framework that gives domain teams autonomy while
                maintaining enterprise control.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:ramukamath@outlook.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d97757] text-white rounded-lg text-sm font-semibold hover:bg-[#c2622a] transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Me
              </a>
              <a
                href="https://www.linkedin.com/in/ramu-k-b5b40499"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-semibold hover:border-orange-300 hover:text-[#d97757] transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Photo */}
          <div className="relative min-h-[400px] lg:min-h-0">
            <img
              src="/photo.jpg"
              alt="Ramu Kamath"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
