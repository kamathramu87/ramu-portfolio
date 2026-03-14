import { Link } from 'react-router-dom';

export default function BlogList() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24" />

      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="text-[#d97757] hover:text-[#c2622a] text-sm font-medium flex items-center gap-1.5 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Home
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Practical insights on data engineering, cloud architecture, and building scalable data platforms.
          </p>
        </div>
      </div>

      {/* Empty state */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Articles coming soon</h2>
        <p className="text-gray-500 max-w-md">
          I'm working on articles about data engineering, cloud architecture, and platform design. Check back soon.
        </p>
      </div>
    </div>
  );
}
