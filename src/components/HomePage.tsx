'use client';
import { useRouter } from 'next/navigation';
import { ChevronRight, TrendingUp, Tag, Zap, ShoppingBag, LucideIcon } from 'lucide-react';

interface Category {
  title: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
}

export default function HomePage() {
  const router = useRouter();

  const categories: Category[] = [
    { title: 'Trending Now', icon: TrendingUp, color: 'bg-red-100', textColor: 'text-red-800' },
    { title: 'New Arrivals', icon: Zap, color: 'bg-green-100', textColor: 'text-green-800' },
    { title: 'Sale Items', icon: Tag, color: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { title: 'Clearance', icon: ShoppingBag, color: 'bg-purple-100', textColor: 'text-purple-800' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Discover Your Style</span>
              <span className="block text-blue-600">Shop the Latest Trends</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Find the perfect items that match your interests and style. Join our community of fashion enthusiasts.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <button
                onClick={() => router.push('/interests')}
                className="rounded-3xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center justify-center gap-2"
              >
                Set Your Interests
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Categories</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="relative rounded-3xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className={`inline-flex rounded-lg p-3 ${category.color}`}>
                <category.icon className={`h-6 w-6 ${category.textColor}`} />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{category.title}</h3>
              <p className="mt-2 text-sm text-gray-500">
                Explore our collection of {category.title.toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Stay Updated</h2>
            <p className="mt-3 text-xl text-gray-500">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-2xl shadow">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-5 py-3 border border-r-0 border-gray-300 rounded-l-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button className="px-5 py-3 border border-transparent text-base font-medium rounded-r-2xl text-white bg-blue-600 hover:bg-blue-500">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}