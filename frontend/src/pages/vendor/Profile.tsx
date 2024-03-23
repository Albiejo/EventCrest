
import { useLocation } from 'react-router-dom'
import VendorAbout from '../../components/vendor/Profile/VendorAbout'
import VendorCover from '../../components/vendor/Profile/VendorCover'
import VendorDetails from '../../components/vendor/Profile/VendorDetails'
import VendorTabs from '../../components/vendor/Profile/VendorTabs'
import Review from '../../components/vendor/Profile/Review'

const VendorProfilePage = () => {
  const location=useLocation()
  const path=location.pathname
  return (
   <>
   <VendorCover/>
   <VendorDetails/>
   <VendorTabs/>
   {path=='/viewVendor'?<Review/>:""}
   <VendorAbout/>
   </>
  )
}

export default VendorProfilePage