import Link from 'next/link';
import { Search, Shield, Users, MapPin, Bed, Bath, Square } from 'lucide-react';

export default function PublicHomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Rently
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-primary-600">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-primary-600">
                How it Works
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-primary-600">
                Pricing
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-primary-600">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="btn-ghost">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-primary-600"> Rental Home</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover thousands of rental properties with our comprehensive search platform. 
            From cozy apartments to spacious houses, find the perfect place to call home.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Enter city, neighborhood, or address"
                    className="input pl-10 w-full"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="input">
                  <option>Any Type</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                </select>
                <select className="input">
                  <option>Any Price</option>
                  <option>$500 - $1000</option>
                  <option>$1000 - $1500</option>
                  <option>$1500 - $2000</option>
                  <option>$2000+</option>
                </select>
                <button className="btn-primary px-6">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rently?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding and managing rental properties simple, secure, and efficient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Advanced filters and AI-powered recommendations help you find the perfect property quickly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Trusted</h3>
              <p className="text-gray-600">
                Verified listings, secure payments, and trusted landlords ensure a safe rental experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Join a community of renters and landlords with reviews, ratings, and shared experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600">
              Discover some of our most popular rental listings
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-4 right-4 bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                    Featured
                  </div>
                </div>
                <div className="card-content">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Modern {i === 1 ? 'Downtown Apartment' : i === 2 ? 'Family House' : 'Luxury Condo'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Beautiful {i === 1 ? '1-bedroom apartment' : i === 2 ? '3-bedroom house' : '2-bedroom condo'} 
                    in a prime location with modern amenities.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {i === 1 ? '1' : i === 2 ? '3' : '2'}
                      </span>
                      <span className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {i === 1 ? '1' : i === 2 ? '2' : '2'}
                      </span>
                      <span className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {i === 1 ? '750' : i === 2 ? '1,200' : '950'} sq ft
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      ${i === 1 ? '1,200' : i === 2 ? '2,100' : '1,800'}/month
                    </span>
                    <Link href={`/property/${i}`} className="btn-outline">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/search" className="btn-primary btn-lg">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Rently Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search & Browse</h3>
              <p className="text-gray-600">
                Use our advanced search filters to find properties that match your criteria.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Schedule</h3>
              <p className="text-gray-600">
                Contact landlords directly and schedule viewings at your convenience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rent & Enjoy</h3>
              <p className="text-gray-600">
                Complete the rental process and move into your new home with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of happy renters who found their perfect home with Rently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-secondary btn-lg">
              Get Started Today
            </Link>
            <Link href="/search" className="btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-600">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-primary-400 mb-4">Rently</h3>
              <p className="text-gray-400">
                Making rental property search and management simple, secure, and efficient.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Renters</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/search" className="hover:text-white">Search Properties</Link></li>
                <li><Link href="/favorites" className="hover:text-white">Saved Properties</Link></li>
                <li><Link href="/rental-guide" className="hover:text-white">Rental Guide</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Landlords</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/landlord-dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/list-property" className="hover:text-white">List Property</Link></li>
                <li><Link href="/tenant-screening" className="hover:text-white">Tenant Screening</Link></li>
                <li><Link href="/property-management" className="hover:text-white">Property Management</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rently. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
