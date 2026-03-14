import { certifications } from '../data/certifications';

const logoColors: Record<string, { bg: string; text: string }> = {
  MS: { bg: '#0078d4', text: '#ffffff' },
  AWS: { bg: '#ff9900', text: '#ffffff' },
  GCP: { bg: '#ea4335', text: '#ffffff' },
  DB: { bg: '#ff3621', text: '#ffffff' },
  OR: { bg: '#c74634', text: '#ffffff' },
  TD: { bg: '#f96702', text: '#ffffff' },
  PSM: { bg: '#d97757', text: '#ffffff' },
};

export default function Certifications() {
  const groups = [
    { label: 'Microsoft Azure', category: 'azure' },
    { label: 'Amazon Web Services', category: 'aws' },
    { label: 'Google Cloud', category: 'gcp' },
    { label: 'Databricks', category: 'databricks' },
    { label: 'Other', category: 'other' },
  ];

  return (
    <section id="certifications" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#d97757]" />
            <span className="text-[#d97757] font-semibold text-sm uppercase tracking-wider">Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Certifications</h2>
          <p className="text-gray-500 max-w-2xl">
            11 professional certifications across Azure, AWS, GCP, and Databricks — validating expertise
            across the full cloud data engineering stack.
          </p>
        </div>

        {/* All Certs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {certifications.map((cert) => {
            const logoStyle = logoColors[cert.logo] || { bg: '#6b7280', text: '#ffffff' };
            return (
              <div
                key={cert.id}
                className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-200"
              >
                {/* Logo */}
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: logoStyle.bg, color: logoStyle.text }}
                >
                  {cert.logo}
                </div>
                {/* Content */}
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-sm leading-tight mb-1">{cert.name}</div>
                  <div className="text-xs text-gray-400">{cert.issuer}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary by provider */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-50 rounded-2xl p-8 border border-orange-100">
          <h3 className="font-bold text-gray-900 text-lg mb-6">Certification Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {groups.map(({ label, category }) => {
              const count = certifications.filter((c) => c.category === category).length;
              return (
                <div key={category} className="text-center">
                  <div className="text-3xl font-bold text-[#d97757] mb-1">{count}</div>
                  <div className="text-xs text-gray-600 font-medium">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
