'use client';

import { useState } from 'react';
import { Button, Input } from '@homely-quad/shared';
import { useAuth } from '@homely-quad/shared';
import { formatCurrency } from '@homely-quad/shared';
import Link from 'next/link';

// Mock data - in a real app, this would come from your API
const featuredProperties = [
  {
    id: '1',
    title: 'Modern Apartment in Downtown',
    price: 2500,
    currency: 'USD',
    location: 'New York, NY',
    image: 'https://via.placeholder.com/400x300',
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: '2',
    title: 'Cozy House with Garden',
    price: 1800,
    currency: 'USD',
    location: 'San Francisco, CA',
    image: 'https://via.placeholder.com/400x300',
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: '3',
    title: 'Luxury Condo with Pool',
    price: 3500,
    currency: 'USD',
    location: 'Miami, FL',
    image: 'https://via.placeholder.com/400x300',
    bedrooms: 2,
    bathrooms: 3,
  },
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Homely Quad</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user?.firstName}</span>
                  <Button variant="outline" size="sm">Profile</Button>
                  <Button variant="ghost" size="sm">Logout</Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Home
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Discover thousands of properties and connect with property owners
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search by location, property type, or features..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1"
              />
              <Button size="lg" className="px-8">
                Search Properties
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Featured Properties
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="card hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                <div className="card-content">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {property.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(property.price, property.currency)}
                    </span>
                    <div className="text-sm text-gray-500">
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </div>
                  </div>
                  <Button className="w-full">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Homely Quad?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h4>
              <p className="text-gray-600">
                Find properties that match your exact requirements with our advanced search filters.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Save Favorites</h4>
              <p className="text-gray-600">
                Keep track of properties you love and easily compare them side by side.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Direct Contact</h4>
              <p className="text-gray-600">
                Connect directly with property owners and get answers to your questions quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Homely Quad</h4>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect rental property.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Renters</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Search Properties</a></li>
                <li><a href="#" className="hover:text-white">Saved Searches</a></li>
                <li><a href="#" className="hover:text-white">Favorites</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Owners</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">List Property</a></li>
                <li><a href="#" className="hover:text-white">Manage Listings</a></li>
                <li><a href="#" className="hover:text-white">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Homely Quad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
