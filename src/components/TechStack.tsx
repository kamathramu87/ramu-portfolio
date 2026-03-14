import TechIcon from './TechIcon';

const TECH_PILLS = ['Databricks', 'Azure', 'AWS', 'Terraform', 'Kubernetes', 'Airflow', 'Unity Catalog', 'Python'];

export default function TechStack() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
