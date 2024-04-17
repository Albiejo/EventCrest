import DefaultLayout from '../../../Layout/DefaultLayout'
import Breadcrumb from '../../../Components/vendor/Breadcrumbs/Breadcrumb';
import BookingTable from '../../../Components/vendor/Tables/BookingTable';

const BookingHistory = () => {
  return (
    <DefaultLayout>
    <Breadcrumb pageName="History" folderName='Booking'/>

    <div className="flex flex-col gap-10">
      
      <BookingTable/>
      
    </div>
  </DefaultLayout>
  )
}

export default BookingHistory