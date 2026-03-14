export interface SkillCategory {
  category: string;
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'Cloud & Platforms',
    icon: '☁️',
    skills: ['Azure', 'AWS', 'GCP', 'Databricks', 'Azure Kubernetes Service', 'Azure DevOps'],
  },
  {
    category: 'Data Engineering',
    icon: '⚙️',
    skills: ['ETL/ELT', 'Apache Airflow', 'Apache Spark', 'Data Modeling', 'Data Lake', 'Unity Catalog', 'Data Quality', 'Metadata Management'],
  },
  {
    category: 'Programming',
    icon: '💻',
    skills: ['Python', 'SQL', 'TypeScript', 'Bash', 'HCL (Terraform)'],
  },
  {
    category: 'DevOps & Infrastructure',
    icon: '🚀',
    skills: ['Terraform', 'Docker', 'Kubernetes', 'Helm', 'Ansible', 'CI/CD', 'GitHub Actions'],
  },
  {
    category: 'Databases & Storage',
    icon: '🗄️',
    skills: ['Delta Lake', 'Amazon Neptune', 'AWS Glue', 'S3', 'Azure Data Lake', 'PostgreSQL'],
  },
  {
    category: 'Methodologies',
    icon: '📋',
    skills: ['Agile / Scrum', 'FinOps', 'DataOps', 'Domain-Driven Design', 'Data Mesh'],
  },
];

export const topTechnologies = [
  { name: 'Databricks', color: 'bg-orange-100 text-orange-800' },
  { name: 'Azure', color: 'bg-blue-100 text-blue-800' },
  { name: 'AWS', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Python', color: 'bg-orange-100 text-orange-800' },
  { name: 'Terraform', color: 'bg-purple-100 text-purple-800' },
  { name: 'Airflow', color: 'bg-red-100 text-red-800' },
  { name: 'Kubernetes', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'Apache Spark', color: 'bg-orange-100 text-orange-800' },
  { name: 'Delta Lake', color: 'bg-teal-100 text-teal-800' },
  { name: 'Docker', color: 'bg-cyan-100 text-cyan-800' },
  { name: 'SQL', color: 'bg-gray-100 text-gray-800' },
  { name: 'TypeScript', color: 'bg-blue-100 text-blue-800' },
];
