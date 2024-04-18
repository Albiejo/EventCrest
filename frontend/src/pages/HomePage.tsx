import { Suspense, lazy } from 'react';

const Hero = lazy(() => import('../Components/home/Hero'));
const Footer = lazy(() => import('../Components/home/Footer'));
const VendorList = lazy(() => import('../Components/home/VendorList'));
const Hero2 = lazy(() => import('../Components/home/Hero2'));
const Hero3 = lazy(() => import('../Components/home/Hero3'));
const Hero4 = lazy(() => import('../Components/home/Hero4'));
const Vtypecarousel = lazy(() => import('../Components/home/Vtypecarousel'));
import LoadingSpinner from '../Components/common/LoadingSpinner';


function Home() {



  
  return (
    <>
      <Suspense fallback={<LoadingSpinner/>}>
        <Hero />
        <VendorList />
        <Hero2 />
        <Hero3 />
        <Hero4 />
        <Vtypecarousel/>
        <Footer />
      </Suspense>
    </>
  );
}

export default Home;
