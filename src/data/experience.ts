export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type?: string;
  description: string[];
  tags: string[];
}

export const experiences: ExperienceItem[] = [
  {
    id: '1',
    company: 'ABN AMRO Bank N.V.',
    role: 'Senior Data Platform Engineer',
    period: 'Aug 2023 – Present',
    location: 'Amsterdam, Netherlands',
    description: [
      'Designed and implemented Databricks lakehouse architecture on Azure for next-generation Data & AI platform',
      'Deployed infrastructure using Terraform and Helm on Azure Kubernetes Service (AKS)',
      'Implemented Unity Catalog for enterprise-grade data governance and lineage',
      'Built CI/CD pipelines with Databricks Asset Bundles (DAB) and Azure DevOps',
      'Developed modern ingestion and ETL frameworks for domain data teams',
      'Created CookieCutter templating system for repository automation and standardization',
      'Led FinOps initiatives for cloud cost optimization across data platform workloads',
      'Designed Airflow orchestration framework on AKS for scalable pipeline management',
    ],
    tags: ['Databricks', 'Azure', 'Terraform', 'AKS', 'Unity Catalog', 'Airflow', 'Python', 'FinOps'],
  },
  {
    id: '2',
    company: 'NN Investment Partners',
    role: 'Freelance Senior Data Platform Engineer',
    period: 'Aug 2022 – Aug 2023',
    location: 'Voorburg, Netherlands',
    type: 'Freelance',
    description: [
      'Built end-to-end application stack on AWS for investment data platform',
      'Designed and implemented ETL historical load engine for large-scale data migration',
      'Integrated Graph database (Neptune) as reference database for entity relationships',
      'Provisioned infrastructure using AWS CDK (TypeScript) and CloudFormation',
      'Developed and maintained Airflow data pipelines for automated data workflows',
    ],
    tags: ['AWS', 'CDK', 'TypeScript', 'Neptune', 'Airflow', 'CloudFormation', 'ETL'],
  },
  {
    id: '3',
    company: 'ABN AMRO Bank',
    role: 'Senior Data Engineer',
    period: '2020 – Jul 2022',
    location: 'Amsterdam, Netherlands',
    description: [
      'Architected data pipeline infrastructure for Domain Data Store initiative',
      'Built comprehensive Data Quality Framework for enterprise data validation',
      'Developed CLI utility for automated ETL configuration generation',
      'Designed parallel data processing architecture improving throughput by 3x',
      'Optimized Databricks cluster configurations for cost and performance efficiency',
    ],
    tags: ['Databricks', 'Python', 'SQL', 'Data Quality', 'Azure', 'ETL', 'CLI'],
  },
  {
    id: '4',
    company: 'Datlinq – a Roamler Company',
    role: 'Senior Data Engineer',
    period: 'Aug 2019 – Jun 2020',
    location: 'Rotterdam, Netherlands',
    description: [
      'Built scalable data pipelines handling real-time and batch processing workloads',
      'Implemented containerized orchestration system with Airflow DAGs on Kubernetes',
      'Led GCP to AWS cloud migration achieving 30% infrastructure cost reduction',
      'Developed real-time data streaming solutions for product analytics',
    ],
    tags: ['GCP', 'AWS', 'Airflow', 'Kubernetes', 'Python', 'Streaming', 'Docker'],
  },
  {
    id: '5',
    company: 'Aegon Nederland',
    role: 'Senior Data Engineer',
    period: 'Feb 2019 – Jul 2019',
    location: 'Voorburg, Netherlands',
    description: [
      'Built AWS Glue data pipelines for financial data layer processing',
      'Set up enterprise data lake architecture on AWS S3',
      'Implemented CI/CD automation with CloudFormation and Ansible',
    ],
    tags: ['AWS', 'Glue', 'S3', 'CloudFormation', 'Ansible', 'Python'],
  },
  {
    id: '6',
    company: 'Accenture',
    role: 'Digital Data Engineer',
    period: '2009 – 2018',
    location: 'Bangalore, India / Amsterdam, Netherlands',
    description: [
      'Built enterprise data lake using HDFS processing modem logs, CDRs, and web logs',
      'Designed semantic layer enabling downstream applications and analytics',
      'Developed reusable ETL solutions reducing development time by 40%',
      'Delivered data warehouse solutions for multiple Fortune 500 clients',
    ],
    tags: ['Hadoop', 'HDFS', 'Hive', 'ETL', 'Data Warehouse', 'SQL', 'Python'],
  },
];
