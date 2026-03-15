import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getBlogPost, getLatestPosts } from '../data/blog';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-16">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Post not found</h1>
          <p className="text-gray-500 mb-6">This blog post doesn't exist or has been moved.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d97757] text-white rounded-lg font-semibold text-sm hover:bg-[#c2622a] transition-colors duration-200"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = getLatestPosts(4).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header spacing */}
      <div className="pt-16" />

      {/* Article header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-[#d97757] transition-colors duration-200">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-[#d97757] transition-colors duration-200">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{post.title}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-orange-50 text-[#c2622a] text-xs font-semibold rounded-full border border-orange-100"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-2xl">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#d97757] rounded-full flex items-center justify-center text-white font-bold text-sm">
                RK
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Ramu Kamath</div>
                <div className="text-xs text-gray-400">Senior Data Platform Engineer</div>
              </div>
            </div>
            <div className="h-5 w-px bg-gray-200" />
            <div className="text-sm text-gray-500">{formatDate(post.date)}</div>
            <div className="h-5 w-px bg-gray-200" />
            <div className="text-sm text-gray-500 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readTime}
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content */}
          <div className="lg:col-span-8">
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </article>

            {/* Article footer */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Written by</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d97757] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      RK
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Ramu Kamath</div>
                      <div className="text-xs text-gray-400">Voorburg, Netherlands</div>
                    </div>
                  </div>
                </div>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-[#d97757] font-semibold text-sm hover:text-[#c2622a] transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tags */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* About author */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">About the Author</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#d97757] rounded-full flex items-center justify-center text-white font-bold">
                  RK
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Ramu Kamath</div>
                  <div className="text-xs text-gray-400">Data Platform Engineer</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Senior Data Platform Engineer at ABN AMRO Bank, specializing in Databricks, Azure, and data governance.
              </p>
              <a
                href="https://www.linkedin.com/in/ramu-k-b5b40499"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#d97757] font-semibold hover:text-[#c2622a] transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect on LinkedIn
              </a>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">More Articles</h3>
                <div className="space-y-3">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      to={`/blog/${related.slug}`}
                      className="block group"
                    >
                      <div className="text-sm font-medium text-gray-700 group-hover:text-[#d97757] transition-colors duration-200 leading-snug">
                        {related.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{formatDate(related.date)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
