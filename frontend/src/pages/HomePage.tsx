import { Suspense, lazy } from 'react';

const Hero = lazy(() => import('../components/Home/Hero'));
const Footer = lazy(() => import('../components/Home/Footer'));
const VendorList = lazy(() => import('../components/Home/VendorList'));
const Hero2 = lazy(() => import('../components/Home/Hero2'));
const Hero3 = lazy(() => import('../components/Home/Hero3'));
const Hero4 = lazy(() => import('../components/Home/Hero4'));
import LoadingSpinner from '../components/LoadingSpinner';


function Home() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner/>}>
        <Hero />
        <VendorList />
        <Hero2 />
        <Hero3 />
        <Hero4 />
        <Footer />
      </Suspense>
    </>
  );
}

export default Home;
