// "use client";
// import { CircleUserRound, ShoppingCart } from 'lucide-react';
// import { FC, useEffect, useState } from 'react';
// import styles from './ProductDetails.module.scss';
// import { useRouter } from 'next/navigation'
// import products from '../staticdata/Products';

// interface ProductDescriptionProps {
//   id: number; // Accepting id as a number
// }

// const ProductDescription: FC<ProductDescriptionProps> = ({ id }) => {
//   const [showModal, setShowModal] = useState(false); // Modal state
//   const [isBooked, setIsBooked] = useState(false);
//   const [bookingDate, setBookingDate] = useState('');
//   const [bookingTime, setBookingTime] = useState('');
//   const [currentDate, setCurrentDate] = useState<string>('');
//   const [currentTime, setCurrentTime] = useState<string>('');
//   const [endTime, setEndTime] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const router = useRouter()

//   useEffect(() => {
//     // Set current date and time in the proper format
//     const today = new Date();
//     const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
//     const formattedTime = today.toTimeString().slice(0, 5); // HH:MM format

//     setCurrentDate(formattedDate);
//     setCurrentTime(formattedTime);
//   }, []);


//   // Log the id to ensure it's being passed correctly
//   useEffect(() => {
//     console.log("Product ID:", id);
//   }, [id]);

//   // Convert id to a number if it's a string (optional safeguard)
//   const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

//   // Find the product by id
//   const product = products.find((p) => p.id === numericId);

//   console.log("aqd", product)

//   if (!product) {
//     return <p>Product not found.</p>;
//   }

//   const handleBooking = () => {
//     if (!bookingDate || !bookingTime || !endDate || !endTime) {
//       alert("Please select a start date, end date, start time, and end time.");
//       return;
//     }


   

//     // Validate that end date is not before start date
//     if (endDate < bookingDate || (endDate === bookingDate && endTime <= bookingTime)) {
//       alert("End date and time cannot be before the start date and time.");
//       return;
//     }

//     setShowModal(true); // Show modal on button click
//   };


//   const handleConfirmBooking = () => {
//     const rental = {
//       productTitle: product.title,
//       productId: product.id,
//       bookingDate,
//       bookingTime,
//       endDate,
//       endTime,
//     };

//     // Store the rental in localStorage
//     const storedRentals = JSON.parse(localStorage.getItem('rentals') || '[]');
//     storedRentals.push(rental);
//     localStorage.setItem('rentals', JSON.stringify(storedRentals));

//     setIsBooked(true);
//     setShowModal(false); // Hide modal after confirmation

//     // Redirect to My Rentals after booking
//     setTimeout(() => {
//       router.push('/myrentals');
//     }, 1000); // Delay to allow user to see the confirmation
//   };



//   return (
//     <div className={styles.product_details__description }>
//       <div className={styles.product_details__title}>
//         <h2>{product.title}</h2>
//         <p>{product.text}</p>
//         <p>$800.000.000</p>
//       </div>

//       <div className={styles.product_details__img}>
//         <img src={product?.img} alt={product.title} />
//       </div>

//       <div className={styles.product_details__condition}>
//         <span>
//           <label htmlFor="radio1">New</label>
//           <input type="radio" id="radio1" name="option" disabled />
//         </span>

//         <span>
//           <label htmlFor="radio2">Used</label>
//           <input type="radio" id="radio2" name="option" disabled checked />
//         </span>
//       </div>

//       {/* <p className={styles.product_details__text}>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae quae sapiente adipisci
//         explicabo, nisi obcaecati aperiam mollitia quisquam voluptates quas impedit ipsum ut ab cum
//         reiciendis perferendis praesentium sunt dolor iste aliquam quos labore! Voluptatum eius ea
//         porro accusamus architecto sequi hic repellendus, fuga nulla, vitae minima praesentium vel
//         ut?
//       </p> */}

//       <div className={styles.product_details__score}>
//         <div className={styles.product_details__user}>
//           <CircleUserRound color="#4f4f4f" />
//           <span>Alex Ford</span>
//         </div>

//         <div className={styles.product_details__rating}>
//           {[...Array(5)].map((_, i) => (
//             <span key={i} className={`${i < 3 ? `${styles.active}` : ''}`}>
//               ★
//             </span>
//           ))}
//           <p>(144)</p>
//         </div>
//       </div>

//       <div className='flex flex-col justify-center items-center gap-3 m-2 mb-5'>
//         <label className="w-full text-left font-semibold" htmlFor="bookingDate">Start Date</label>
//         <input type="date"  value={bookingDate}  min={currentDate} onChange={(e) => setBookingDate(e.target.value)} name="bookingDate" id="bookingDate" className='w-full px-3 py-1 border-2 border-black rounded-lg'/>
        
//         <label className="w-full text-left font-semibold" htmlFor="bookingTime">Start Time</label>
//         <input type="time"  value={bookingTime} disabled={!bookingDate} onChange={(e) => setBookingTime(e.target.value)} name="bookingTime" id="bookingTime" className='w-full px-3 py-1 border-2 border-black rounded-lg'/>
        
//         <label className="w-full text-left font-semibold" htmlFor="endDate">End Date</label>
//         <input type="date"  value={endDate}  disabled={!bookingDate}  onChange={(e) => setEndDate(e.target.value)} name="endDate" id="endDate" className='w-full px-3 py-1 border-2 border-black rounded-lg'/>
        
//         <label className="w-full text-left font-semibold" htmlFor="endTime">End Time</label>
//         <input type="time"  value={endTime} disabled={!endDate}  onChange={(e) => setEndTime(e.target.value)} name="endTime" id="endTime" className='w-full px-3 py-1 border-2 border-black rounded-lg'/>
//       </div>

//       <button onClick={handleBooking} disabled={isBooked} className='!bg-green-500 hover:!bg-green-500/85'>
//         <ShoppingCart size={18} color="#fff" />
//         <span>{isBooked ? "Already Booked" : "Initiate rental"}</span>
//       </button>

//        {/* Modal */}
//        {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">{product.title}</h2>
//             <p className="text-gray-700 mb-4">{product.text}</p>
//             <div className="mb-4">
//               <p><strong>Start Date:</strong> {bookingDate}</p>
//               <p><strong>Start Time:</strong> {bookingTime}</p>
//               <p><strong>End Date:</strong> {endDate}</p>
//               <p><strong>End Time:</strong> {endTime}</p>
//             </div>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmBooking}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Confirm Booking
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDescription;
"use client";
import { CircleUserRound, ShoppingCart } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import styles from './ProductDetails.module.scss';
import { useRouter } from 'next/navigation';
import products from '../staticdata/Products';

interface ProductDescriptionProps {
  id: number; // Accepting id as a number
}

const ProductDescription: FC<ProductDescriptionProps> = ({ id }) => {
  const [showModal, setShowModal] = useState(false); // Modal state
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [endTime, setEndTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0); // State to track the calculated price
  const router = useRouter();

  const hourlyRate = 8; // Example rate: $8 per hour

  useEffect(() => {
    // Set current date and time in the proper format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    const formattedTime = today.toTimeString().slice(0, 5); // HH:MM format

    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  }, []);

  // Log the id to ensure it's being passed correctly
  useEffect(() => {
    console.log("Product ID:", id);
  }, [id]);

  // Convert id to a number if it's a string (optional safeguard)
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  // Find the product by id
  const product = products.find((p) => p.id === numericId);

  if (!product) {
    return <p>Product not found.</p>;
  }

  const calculatePrice = () => {
    if (!bookingDate || !bookingTime || !endDate || !endTime) {
      return 0;
    }

    const start = new Date(`${bookingDate}T${bookingTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours

    // Ensure the duration is positive
    if (durationInHours > 0) {
      return durationInHours * hourlyRate;
    }
    return 0;
  };

  const handleBooking = () => {
    if (!bookingDate || !bookingTime || !endDate || !endTime) {
      alert("Please select a start date, end date, start time, and end time.");
      return;
    }

    // Validate that end date is not before start date
    if (endDate < bookingDate || (endDate === bookingDate && endTime <= bookingTime)) {
      alert("End date and time cannot be before the start date and time.");
      return;
    }

    const calculatedPrice = calculatePrice();
    setTotalPrice(calculatedPrice);
    setShowModal(true); // Show modal on button click
  };

  const handleConfirmBooking = () => {
    const rental = {
      productTitle: product.title,
      productId: product.id,
      bookingDate,
      bookingTime,
      endDate,
      endTime,
      totalPrice,
    };

    // Store the rental in localStorage
    const storedRentals = JSON.parse(localStorage.getItem('rentals') || '[]');
    storedRentals.push(rental);
    localStorage.setItem('rentals', JSON.stringify(storedRentals));

    setIsBooked(true);
    setShowModal(false); // Hide modal after confirmation

    // Redirect to My Rentals after booking
    setTimeout(() => {
      router.push('/myrentals');
    }, 1000); // Delay to allow user to see the confirmation
  };

  return (
    <div className={styles.product_details__description }>
      <div className={styles.product_details__title}>
        <h2>{product.title}</h2>
        <p>{product.text}</p>
        <p>Price: ${hourlyRate} per hour</p> {/* Display initial hourly rate */}
        <p>Total Price: ${totalPrice.toFixed(2)}</p> {/* Display the calculated price */}
      </div>

      <div className={styles.product_details__img}>
        <img src={product?.img} alt={product.title} />
      </div>

      <div className={styles.product_details__condition}>
        <span>
          <label htmlFor="radio1">New</label>
          <input type="radio" id="radio1" name="option" disabled />
        </span>

        <span>
          <label htmlFor="radio2">Used</label>
          <input type="radio" id="radio2" name="option" disabled checked />
        </span>
      </div>

      <div className='flex flex-col justify-center items-center gap-3 m-2 mb-5'>
        <label className="w-full text-left font-semibold" htmlFor="bookingDate">Start Date</label>
        <input type="date"  value={bookingDate}  min={currentDate} onChange={(e) => setBookingDate(e.target.value)} name="bookingDate" id="bookingDate" className='w-full px-3 py-1 border-2 border-black rounded-lg'/>
        
        <label className="w-full text-left font-semibold" htmlFor="bookingTime">Start Time</label>
        <input type="time"  value={bookingTime} disabled={!bookingDate} onChange={(e) => setBookingTime(e.target.value)} name="bookingTime" id="bookingTime" className='w-full px-3 py-1 border-2 border-black rounded-lg'/>
        
        <label className="w-full text-left font-semibold" htmlFor="endDate">End Date</label>
        <input type="date"  value={endDate}  disabled={!bookingDate}  onChange={(e) => setEndDate(e.target.value)} name="endDate" id="endDate" className='w-full px-3 py-1 border-2 border-black rounded-lg'/>
        
        <label className="w-full text-left font-semibold" htmlFor="endTime">End Time</label>
        <input type="time"  value={endTime} disabled={!endDate}  onChange={(e) => setEndTime(e.target.value)} name="endTime" id="endTime" className='w-full px-3 py-1 border-2 border-black rounded-lg'/>
      </div>

      <button onClick={handleBooking} disabled={isBooked} className='!bg-green-500 hover:!bg-green-500/85'>
        <ShoppingCart size={18} color="#fff" />
        <span>{isBooked ? "Already Booked" : "Initiate rental"}</span>
      </button>

       {/* Modal */}
       {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{product.title}</h2>
            <p className="text-gray-700 mb-4">{product.text}</p>
            <div className="mb-4">
              <p><strong>Start Date:</strong> {bookingDate}</p>
              <p><strong>Start Time:</strong> {bookingTime}</p>
              <p><strong>End Date:</strong> {endDate}</p>
              <p><strong>End Time:</strong> {endTime}</p>
              <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p> {/* Show the calculated price */}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
