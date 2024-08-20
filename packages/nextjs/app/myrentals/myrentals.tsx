// 'use client'
// import React, { useEffect, useState } from 'react';

// // Define the type for rental objects
// interface Rental {
//   productTitle: string;
//   productId: number;
//   bookingDate: string;
//   bookingTime: string;
//   endDate: string;
//   endTime: string;
// }

// const MyRental: React.FC = () => {
//   const [rentals, setRentals] = useState<Rental[]>([]); // Use the Rental type for the state

//   useEffect(() => {
//     // Fetch rentals from localStorage
//     const storedRentals: Rental[] = JSON.parse(localStorage.getItem('rentals') || '[]');
//     setRentals(storedRentals);
//   }, []);

//   return (
//     <div className="pt-20 p-2">
//       <h2 className="text-2xl font-bold mb-4">My Rentals</h2>
//       {rentals.length > 0 ? (
//         <ul className="space-y-4">
//           {rentals.map((rental, index) => (
//             <li key={index} className="border p-4 rounded shadow">
//               <p className="font-bold text-lg">{rental.productTitle}</p>
//               <p>Start Date: {rental.bookingDate}</p>
//               <p>Start Time: {rental.bookingTime}</p>
//               <p>End Date: {rental.endDate}</p>
//               <p>End Time: {rental.endTime}</p>
//               {/* <p>Product ID: {rental.productId}</p> */}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No rentals found.</p>
//       )}
//     </div>
//   );
// };

// export default MyRental;
'use client'
import React, { useEffect, useState } from 'react';

// Define the type for rental objects
interface Rental {
  productTitle: string;
  productId: number;
  bookingDate: string;
  bookingTime: string;
  endDate: string;
  endTime: string;
  isReturned?: boolean; // Add a flag to check if the rental is returned
}

const MyRental: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]); // Use the Rental type for the state
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File[] }>({}); // State to track selected files for each rental

  useEffect(() => {
    // Fetch rentals from localStorage
    const storedRentals: Rental[] = JSON.parse(localStorage.getItem('rentals') || '[]');
    setRentals(storedRentals);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, rentalId: number) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles((prev) => ({
      ...prev,
      [rentalId]: files,
    }));
  };

  const handleReturnRental = (rentalId: number) => {
    const files = selectedFiles[rentalId];

    if (!files || files.length === 0) {
      alert('Please upload either an image or a video for safe return.');
      return;
    }

    // Check if at least one image or video file is uploaded
    const hasValidFile = files.some(file => file.type.startsWith('image/') || file.type.startsWith('video/'));

    if (!hasValidFile) {
      alert('Please make sure to upload a valid image or video file.');
      return;
    }

    // Mark the rental as returned
    const updatedRentals = rentals.map((rental) =>
      rental.productId === rentalId ? { ...rental, isReturned: true } : rental
    );
    setRentals(updatedRentals);
    localStorage.setItem('rentals', JSON.stringify(updatedRentals));

    alert('Rental returned successfully!');
  };

  return (
    <div className="pt-20 p-2">
      <h2 className="text-2xl font-bold mb-4">My Rentals</h2>
      {rentals.length > 0 ? (
        <ul className="space-y-4">
          {rentals.map((rental, index) => (
            <li key={index} className="border p-4 rounded shadow">
              <p className="font-bold text-lg">{rental.productTitle}</p>
              <p>Start Date: {rental.bookingDate}</p>
              <p>Start Time: {rental.bookingTime}</p>
              <p>End Date: {rental.endDate}</p>
              <p>End Time: {rental.endTime}</p>

              {/* Only show return option if the rental is not yet returned */}
              {!rental.isReturned && (
                <div className="mt-4">
                  <label className="block mb-2 font-semibold">Upload Image/Video for Safe Return:</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => handleFileChange(e, rental.productId)}
                    className="mb-4"
                  />

                  <button
                    onClick={() => handleReturnRental(rental.productId)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Return Rental
                  </button>
                </div>
              )}

              {/* Show a message if the rental has been returned */}
              {rental.isReturned && (
                <p className="mt-4 text-green-500 font-semibold">Rental returned successfully!</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rentals found.</p>
      )}
    </div>
  );
};

export default MyRental;
