import React from 'react';

interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  imageUrl: string;
}

interface LandingPageHeroProps {
  topRatedVendors: Vendor[];
  categories: string[];
}

const LandingPageHero: React.FC<LandingPageHeroProps> = ({ topRatedVendors, categories }) => {
  return (
    <div className="bg-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          Find the Perfect Vendors for Your Event
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-8">
          Browse through top-rated vendors and explore different categories to make your event
          unforgettable.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRatedVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{vendor.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{vendor.category}</p>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-500 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2.276l1.605 3.894 4.078.353-3.062 2.676.92 4.46-3.54-2.34-3.54 2.34.92-4.46-3.062-2.676 4.078-.353L10 2.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{vendor.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Explore by Category</h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageHero;
