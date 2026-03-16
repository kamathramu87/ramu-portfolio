import { Link } from 'react-router-dom';
import { getLatestPosts } from '../data/blog';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogSection() {
  const posts = getLatestPosts(3);

  return (
    <section id="blog" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#d97757]" />
              <span className="text-[#d97757] font-semibold text-sm uppercase tracking-wider">Writing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Latest Articles</h2>
            <p className="text-gray-500 max-w-xl">
              Sharing lessons learned from building data platforms at scale in financial services.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#d97757] font-semibold text-sm hover:text-[#c2622a] transition-colors duration-200 flex-shrink-0"
          >
            View all posts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h3 className="text-gray-700 font-semibold text-lg mb-2">Articles coming soon</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              I'm working on articles about data engineering, cloud architecture, and platform design. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#d97757] hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-orange-50 text-[#c2622a] text-xs font-semibold rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-gray-900 font-bold text-lg leading-snug mb-3 group-hover:text-[#d97757] transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">{post.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
