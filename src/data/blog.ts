export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readTime: string;
  content: string;
}

import deltaTimeTravel from './posts/delta-time-travel';
import deltaRetention from './posts/delta-retention';
import mcpDatabricksOps from './posts/mcp-databricks-ops';

export const blogPosts: BlogPost[] = [deltaTimeTravel, deltaRetention, mcpDatabricksOps];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getLatestPosts(count: number = 3): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
