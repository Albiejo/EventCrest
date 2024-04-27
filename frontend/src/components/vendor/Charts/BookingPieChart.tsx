
import { Pie } from 'react-chartjs-2';



const BookingPieChart = ({ acceptedCount, cancelledCount }) => {
    const data = {
        labels: ['Accepted', 'Cancelled'],
        datasets: [{
          data: [acceptedCount, cancelledCount],
          backgroundColor: [
            'green', // color for accepted bookings
            'red',   // color for cancelled bookings
          ],
        }],
      };

      const options = {
        maintainAspectRatio: false, // Set to false to allow the chart to resize
        responsive: true,            // Make the chart responsive
        // You can add more options here to customize the appearance
      };
    
      return (
        <div className="mt-8 pl-10  text-center" style={{ position: 'relative', width: '300px', height: '300px' }}>
        <h2 className='text-black font-bold mt-4 mb-2'>Booking Status</h2>
        <Pie data={data} options={options} />
        </div>
      );
}

export default BookingPieChart