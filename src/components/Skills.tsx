import { skillCategories, topTechnologies } from '../data/skills';

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#d97757]" />
            <span className="text-[#d97757] font-semibold text-sm uppercase tracking-wider">Expertise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Skills & Technologies</h2>
          <p className="text-gray-500 max-w-2xl">
            A comprehensive toolkit built over 15+ years in the data engineering trenches.
          </p>
        </div>

        {/* Top Technologies Badges */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Core Technologies</h3>
          <div className="flex flex-wrap gap-2.5">
            {topTechnologies.map((tech) => (
              <span
                key={tech.name}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-transform duration-150 hover:scale-105 cursor-default ${tech.color}`}
                style={{ borderColor: 'currentColor', opacity: 0.8 }}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Skill Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.category}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="font-bold text-gray-900">{category.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-md border border-gray-200 hover:bg-orange-50 hover:text-[#c2622a] hover:border-orange-200 transition-colors duration-150"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
