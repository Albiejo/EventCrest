import React from 'react';
import Footer from '../components/Home/Footer';

const AboutPage = () => {
    return (
        <>
        <div className=" text-white py-16"  style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center relative">
              <img src="/imgs/sea.jpg" alt="Event Crest Banner" className="w-full h-96 object-cover rounded-lg mb-8" />
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <img src="/imgs/log.jpeg" alt="Event Crest Logo" className="w-64 mx-auto" />
                <h2 className="text-3xl font-bold mt-4 text-black">We are Event Crest</h2>
                <p className="mt-2 text-lg  text-black">Bringing dream Events to life!</p>
              </div>
            </div>
            <div className="mt-16 text-center">
              <p className="text-lg  text-black">
                Event Crest is an Indian online event planning platform and event media publisher, enabling people to plan their events conveniently and cost-effectively.
              </p>
              <p className="mt-4 text-lg  text-black">
                Event Crest is on a mission to make event planning in India exciting and hassle-free. With a millennial army of event fanatics, Event Crest aims to aid the event blues of every new-age couple across the country.
              </p>
              <p className="mt-4 text-lg  text-black">
                We're a driven team of event enthusiasts working to build a new way of event planning through delightful products and amazing customer service. We're proud to have been the official event planner of celebrities like Yuvraj Singh & Bhuvneshwar Kumar. We love what we do, and that's how we help plan your event like a loved one!
              </p>
            </div>
            <div className="mt-16 text-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-pink-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                  <p className="text-4xl font-bold  text-black">6000+</p>
                  <p className="mt-2 text-lg  text-black">Wedding Vendors</p>
                </div>
                <div className="bg-pink-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                  <p className="text-4xl font-bold  text-black">500+</p>
                  <p className="mt-2 text-lg  text-black">Birthday Vendors</p>
                </div>
                <div className="bg-pink-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                  <p className="text-4xl font-bold  text-black">20M+</p>
                  <p className="mt-2 text-lg  text-black">Monthly Reach</p>
                </div>
                <div className="bg-pink-500 py-8 rounded-lg hover:shadow-2xl hover:border-red-500 transition duration-300 ease-in-out transform">
                  <p className="text-4xl font-bold  text-black">10,000+</p>
                  <p className="mt-2 text-lg  text-black">Annual Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
        </>
      );
    };

export default AboutPage;
