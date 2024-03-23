import React from 'react';
import LandingPageHero from './LandingPageHero';

const LandingPage: React.FC = () => {
  
  const topRatedVendors = [
    {
      id: 1,
      name: 'Vendor 1',
      category: 'Photography',
      rating: 4.5,
      imageUrl: 'https://via.placeholder.com/300',
    },
    {
        id: 1,
        name: 'Vendor 1',
        category: 'Photography',
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/300',
      },
      {
        id: 1,
        name: 'Vendor 1',
        category: 'Photography',
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/300',
      },
      {
        id: 1,
        name: 'Vendor 1',
        category: 'Photography',
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/300',
      }
   
  ];

  const categories = ['Photography', 'Catering', 'Decor', 'Music', 'Venue', 'Planning'];

  return (
    <div>
      <LandingPageHero topRatedVendors={topRatedVendors} categories={categories} />
    </div>
  );
};

export default LandingPage;
