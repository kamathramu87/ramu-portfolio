export interface Certification {
  id: string;
  name: string;
  issuer: string;
  logo: string;
  color: string;
  category: 'azure' | 'aws' | 'gcp' | 'databricks' | 'other';
}

export const certifications: Certification[] = [
  {
    id: '1',
    name: 'Azure Administrator Associate',
    issuer: 'Microsoft',
    logo: 'MS',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    category: 'azure',
  },
  {
    id: '2',
    name: 'Azure Data Engineer Associate',
    issuer: 'Microsoft',
    logo: 'MS',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    category: 'azure',
  },
  {
    id: '3',
    name: 'DevOps Engineer Expert',
    issuer: 'Microsoft',
    logo: 'MS',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    category: 'azure',
  },
  {
    id: '4',
    name: 'Professional Data Engineer',
    issuer: 'Google Cloud',
    logo: 'GCP',
    color: 'bg-red-50 border-red-200 text-red-700',
    category: 'gcp',
  },
  {
    id: '5',
    name: 'Certified Associate Developer for Apache Spark 3.0',
    issuer: 'Databricks',
    logo: 'DB',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    category: 'databricks',
  },
  {
    id: '6',
    name: 'Certified Big Data – Specialty',
    issuer: 'Amazon Web Services',
    logo: 'AWS',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    category: 'aws',
  },
  {
    id: '7',
    name: 'Certified Solution Architect Associate',
    issuer: 'Amazon Web Services',
    logo: 'AWS',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    category: 'aws',
  },
  {
    id: '8',
    name: 'Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    logo: 'AWS',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    category: 'aws',
  },
  {
    id: '9',
    name: 'Oracle 11G Implementation Specialist',
    issuer: 'Oracle',
    logo: 'OR',
    color: 'bg-red-50 border-red-200 text-red-700',
    category: 'other',
  },
  {
    id: '10',
    name: 'TD14 Certified Professional',
    issuer: 'Teradata',
    logo: 'TD',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    category: 'other',
  },
  {
    id: '11',
    name: 'Professional Scrum Master',
    issuer: 'Scrum.org',
    logo: 'PSM',
    color: 'bg-orange-50 border-orange-200 text-[#c2622a]',
    category: 'other',
  },
];
