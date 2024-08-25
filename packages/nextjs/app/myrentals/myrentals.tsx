// "use client";
// import React, { useEffect, useRef, useState } from "react";
// // Define the type for rental objects
// interface Rental {
//   productTitle: string;
//   productId: number;
//   bookingDate: string;
//   bookingTime: string;
//   endDate: string;
//   endTime: string;
//   isReturned?: boolean; // Add a flag to check if the rental is returned
// }
// const MyRental: React.FC = () => {
//   const [rentals, setRentals] = useState<Rental[]>([]); // Use the Rental type for the state
//   const [showCamera, setShowCamera] = useState<{ [key: number]: boolean }>({}); // State to show camera per rental
//   const [capturedImage, setCapturedImage] = useState<{ [key: number]: string }>({}); // State to store captured image per rental
//   const [selectedFile, setSelectedFile] = useState<{ [key: number]: string }>({}); // State to store selected file per rental
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   useEffect(() => {
//     // Fetch rentals from localStorage
//     const storedRentals: Rental[] = JSON.parse(localStorage.getItem("rentals") || "[]");
//     setRentals(storedRentals);
//   }, []);
//   const startCamera = async (rentalId: number) => {
//     setShowCamera(prev => ({ ...prev, [rentalId]: true }));
//     if (navigator.mediaDevices.getUserMedia) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error("Error accessing camera:", err);
//       }
//     }
//   };
//   const captureImage = (rentalId: number) => {
//     if (canvasRef.current && videoRef.current) {
//       const context = canvasRef.current.getContext("2d");
//       if (context) {
//         context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
//         const imageData = canvasRef.current.toDataURL("image/png");
//         setCapturedImage(prev => ({ ...prev, [rentalId]: imageData }));
//         // Stop the camera after capturing the image
//         const stream = videoRef.current.srcObject as MediaStream;
//         const tracks = stream.getTracks();
//         tracks.forEach(track => track.stop());
//         setShowCamera(prev => ({ ...prev, [rentalId]: false }));
//       }
//     }
//   };
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, rentalId: number) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = e => {
//         setSelectedFile(prev => ({ ...prev, [rentalId]: e.target?.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//   const handleReturnRental = (rentalId: number) => {
//     if (!capturedImage[rentalId] && !selectedFile[rentalId]) {
//       alert("Please capture an image or choose a file for safe return.");
//       return;
//     }
//     // Mark the rental as returned
//     const updatedRentals = rentals.map(rental =>
//       rental.productId === rentalId ? { ...rental, isReturned: true } : rental,
//     );
//     setRentals(updatedRentals);
//     localStorage.setItem("rentals", JSON.stringify(updatedRentals));
//     alert("Rental returned successfully!");
//   };
//   return (
//     <div className="p-2 pt-20">
//       <h2 className="mb-4 text-2xl font-bold">My Rentals</h2>
//       {rentals.length > 0 ? (
//         <ul className="space-y-4">
//           {rentals.map((rental, index) => (
//             <li
//               key={index}
//               className="flex w-full items-center justify-between gap-x-4 rounded border p-4 shadow md3:flex-col md3:items-start"
//             >
//               <div>
//                 <p className="text-lg font-bold">{rental.productTitle}</p>
//                 <p>Start Date: {rental.bookingDate}</p>
//                 <p>Start Time: {rental.bookingTime}</p>
//                 <p>End Date: {rental.endDate}</p>
//                 <p>End Time: {rental.endTime}</p>
//               </div>
//               <div>
//                 {/* Only show return option if the rental is not yet returned */}
//                 {!rental.isReturned && (
//                   <div className="mt-4">
//                     {!showCamera[rental.productId] ? (
//                       <>
//                         <button
//                           onClick={() => startCamera(rental.productId)}
//                           className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                         >
//                           AR Inspect
//                         </button>
//                         {capturedImage[rental.productId] && (
//                           <div className="mt-4">
//                             <p className="font-semibold text-green-500">Image captured successfully!</p>
//                             <img src={capturedImage[rental.productId]} alt="Captured" className="mt-2 rounded border" />
//                             <button
//                               onClick={() => handleReturnRental(rental.productId)}
//                               className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
//                             >
//                               Confirm Return
//                             </button>
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <div>
//                         <video ref={videoRef} autoPlay className="mb-4 !h-auto !w-72 rounded border"></video>
//                         <canvas ref={canvasRef} width="500" height="300" className="hidden !h-72 !w-72"></canvas>
//                         <button
//                           onClick={() => captureImage(rental.productId)}
//                           className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                         >
//                           Capture Image
//                         </button>
//                       </div>
//                     )}
//                     <div className="mt-4">
//                       <label htmlFor={`fileInput-${rental.productId}`} className="mb-2 block font-semibold">
//                         Choose File (Image/Video)
//                       </label>
//                       <input
//                         type="file"
//                         accept="image/*,video/*"
//                         id={`fileInput-${rental.productId}`}
//                         onChange={e => handleFileChange(e, rental.productId)}
//                         className="mb-4"
//                       />
//                       {selectedFile[rental.productId] && (
//                         <div className="mt-4">
//                           <p className="font-semibold text-green-500">File selected successfully!</p>
//                           {/* <img src={selectedFile[rental.productId]} alt="Selected" className="mt-2 border rounded h-52 w-52 object-contain" /> */}
//                           <button
//                             onClick={() => handleReturnRental(rental.productId)}
//                             className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
//                           >
//                             Confirm Return
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 {/* Show a message if the rental has been returned */}
//                 {rental.isReturned && (
//                   <p className="mt-4 font-semibold text-green-500">Rental returned successfully!</p>
//                 )}
//               </div>
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
"use client";

import React, { useEffect, useRef, useState } from "react";

// "use client";

// import React, { useEffect, useRef, useState } from "react";

// // Define the type for rental objects
// interface Rental {
//   productTitle: string;
//   productId: number;
//   bookingDate: string;
//   bookingTime: string;
//   endDate: string;
//   endTime: string;
//   isReturned?: boolean; // Add a flag to check if the rental is returned
// }
// const MyRental: React.FC = () => {
//   const [rentals, setRentals] = useState<Rental[]>([]); // Use the Rental type for the state
//   const [showCamera, setShowCamera] = useState<{ [key: number]: boolean }>({}); // State to show camera per rental
//   const [capturedImage, setCapturedImage] = useState<{ [key: number]: string }>({}); // State to store captured image per rental
//   const [selectedFile, setSelectedFile] = useState<{ [key: number]: string }>({}); // State to store selected file per rental
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     // Fetch rentals from localStorage
//     const storedRentals: Rental[] = JSON.parse(localStorage.getItem("rentals") || "[]");
//     setRentals(storedRentals);
//   }, []);

//   const startCamera = async (rentalId: number) => {
//     setShowCamera(prev => ({ ...prev, [rentalId]: true }));
//     if (navigator.mediaDevices.getUserMedia) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error("Error accessing camera:", err);
//       }
//     }
//   };
//   const captureImage = (rentalId: number) => {
//     if (canvasRef.current && videoRef.current) {
//       const context = canvasRef.current.getContext("2d");
//       if (context) {
//         context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
//         const imageData = canvasRef.current.toDataURL("image/png");
//         setCapturedImage(prev => ({ ...prev, [rentalId]: imageData }));
//         // Stop the camera after capturing the image
//         const stream = videoRef.current.srcObject as MediaStream;
//         const tracks = stream.getTracks();
//         tracks.forEach(track => track.stop());
//         setShowCamera(prev => ({ ...prev, [rentalId]: false }));
//       }
//     }
//   };
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, rentalId: number) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = e => {
//         setSelectedFile(prev => ({ ...prev, [rentalId]: e.target?.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//   const handleReturnRental = (rentalId: number) => {
//     if (!capturedImage[rentalId] && !selectedFile[rentalId]) {
//       alert("Please capture an image or choose a file for safe return.");
//       return;
//     }
//     // Mark the rental as returned
//     const updatedRentals = rentals.map(rental =>
//       rental.productId === rentalId ? { ...rental, isReturned: true } : rental,
//     );
//     setRentals(updatedRentals);
//     localStorage.setItem("rentals", JSON.stringify(updatedRentals));
//     alert("Rental returned successfully!");
//   };
//   return (
//     <div className="p-2 pt-20">
//       <h2 className="mb-4 text-2xl font-bold">My Rentals</h2>
//       {rentals.length > 0 ? (
//         <ul className="space-y-4">
//           {rentals.map((rental, index) => (
//             <li
//               key={index}
//               className="flex w-full items-center justify-between gap-x-4 rounded border p-4 shadow md3:flex-col md3:items-start"
//             >
//               <div>
//                 <p className="text-lg font-bold">{rental.productTitle}</p>
//                 <p>Start Date: {rental.bookingDate}</p>
//                 <p>Start Time: {rental.bookingTime}</p>
//                 <p>End Date: {rental.endDate}</p>
//                 <p>End Time: {rental.endTime}</p>
//               </div>
//               <div>
//                 {/* Only show return option if the rental is not yet returned */}
//                 {!rental.isReturned && (
//                   <div className="mt-4">
//                     {!showCamera[rental.productId] ? (
//                       <>
//                         <button
//                           onClick={() => startCamera(rental.productId)}
//                           className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                         >
//                           AR Inspect
//                         </button>
//                         {capturedImage[rental.productId] && (
//                           <div className="mt-4">
//                             <p className="font-semibold text-green-500">Image captured successfully!</p>
//                             <img src={capturedImage[rental.productId]} alt="Captured" className="mt-2 rounded border" />
//                             <button
//                               onClick={() => handleReturnRental(rental.productId)}
//                               className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
//                             >
//                               Confirm Return
//                             </button>
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <div>
//                         <video ref={videoRef} autoPlay className="mb-4 !h-auto !w-72 rounded border"></video>
//                         <canvas ref={canvasRef} width="500" height="300" className="hidden !h-72 !w-72"></canvas>
//                         <button
//                           onClick={() => captureImage(rental.productId)}
//                           className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                         >
//                           Capture Image
//                         </button>
//                       </div>
//                     )}
//                     <div className="mt-4">
//                       <label htmlFor={`fileInput-${rental.productId}`} className="mb-2 block font-semibold">
//                         Choose File (Image/Video)
//                       </label>
//                       <input
//                         type="file"
//                         accept="image/*,video/*"
//                         id={`fileInput-${rental.productId}`}
//                         onChange={e => handleFileChange(e, rental.productId)}
//                         className="mb-4"
//                       />
//                       {selectedFile[rental.productId] && (
//                         <div className="mt-4">
//                           <p className="font-semibold text-green-500">File selected successfully!</p>
//                           {/* <img src={selectedFile[rental.productId]} alt="Selected" className="mt-2 border rounded h-52 w-52 object-contain" /> */}
//                           <button
//                             onClick={() => handleReturnRental(rental.productId)}
//                             className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
//                           >
//                             Confirm Return
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 {/* Show a message if the rental has been returned */}
//                 {rental.isReturned && (
//                   <p className="mt-4 font-semibold text-green-500">Rental returned successfully!</p>
//                 )}
//               </div>
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

interface Rental {
  productTitle: string;
  productId: number;
  bookingDate: string;
  bookingTime: string;
  endDate: string;
  endTime: string;
  isReturned?: boolean;
}

const MyRental: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [showCamera, setShowCamera] = useState<{ [key: number]: boolean }>({});
  const [capturedImage, setCapturedImage] = useState<{ [key: number]: string }>({});
  const [selectedFile, setSelectedFile] = useState<{ [key: number]: string }>({});
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const storedRentals: Rental[] = JSON.parse(localStorage.getItem("rentals") || "[]");
    setRentals(storedRentals);
  }, []);

  const startCamera = async (rentalId: number) => {
    setShowCamera(prev => ({ ...prev, [rentalId]: true }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const captureImage = (rentalId: number) => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(prev => ({ ...prev, [rentalId]: imageData }));
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        setShowCamera(prev => ({ ...prev, [rentalId]: false }));
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, rentalId: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setSelectedFile(prev => ({ ...prev, [rentalId]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReturnRental = (rentalId: number) => {
    if (!capturedImage[rentalId] && !selectedFile[rentalId]) {
      alert("Please capture an image or choose a file for safe return.");
      return;
    }
    const updatedRentals = rentals.map(rental =>
      rental.productId === rentalId ? { ...rental, isReturned: true } : rental,
    );
    setRentals(updatedRentals);
    localStorage.setItem("rentals", JSON.stringify(updatedRentals));
    alert("Rental returned successfully!");
  };

  const toggleCamera = () => {
    setCameraFacingMode(prevMode => (prevMode === "user" ? "environment" : "user"));
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    rentals.forEach(rental => {
      if (showCamera[rental.productId]) {
        startCamera(rental.productId);
      }
    });
  };

  return (
    <div className="p-2 pt-20">
      <h2 className="mb-4 text-2xl font-bold">My Rentals</h2>
      {rentals.length > 0 ? (
        <ul className="space-y-4">
          {rentals.map((rental, index) => (
            <li
              key={index}
              className="flex w-full items-center justify-between gap-x-4 rounded border p-4 shadow md3:flex-col md3:items-start"
            >
              <div>
                <p className="text-lg font-bold">{rental.productTitle}</p>
                <p>Start Date: {rental.bookingDate}</p>
                <p>Start Time: {rental.bookingTime}</p>
                <p>End Date: {rental.endDate}</p>
                <p>End Time: {rental.endTime}</p>
              </div>
              <div>
                {!rental.isReturned && (
                  <div className="mt-4">
                    {!showCamera[rental.productId] ? (
                      <>
                        <button
                          onClick={() => startCamera(rental.productId)}
                          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                          AR Inspect
                        </button>
                        {capturedImage[rental.productId] && (
                          <div className="mt-4">
                            <p className="font-semibold text-green-500">Image captured successfully!</p>
                            <img src={capturedImage[rental.productId]} alt="Captured" className="mt-2 rounded border" />
                            <button
                              onClick={() => handleReturnRental(rental.productId)}
                              className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                            >
                              Confirm Return
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <video ref={videoRef} autoPlay className="mb-4 !h-auto !w-72 rounded border"></video>
                        <canvas ref={canvasRef} width="500" height="300" className="hidden !h-72 !w-72"></canvas>
                        <button
                          onClick={() => captureImage(rental.productId)}
                          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                          Capture Image
                        </button>
                        <button
                          onClick={toggleCamera}
                          className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        >
                          Swap Camera
                        </button>
                      </div>
                    )}
                    <div className="mt-4">
                      <label htmlFor={`fileInput-${rental.productId}`} className="mb-2 block font-semibold">
                        Choose File (Image/Video)
                      </label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        id={`fileInput-${rental.productId}`}
                        onChange={e => handleFileChange(e, rental.productId)}
                        className="mb-4"
                      />
                      {selectedFile[rental.productId] && (
                        <div className="mt-4">
                          <p className="font-semibold text-green-500">File selected successfully!</p>
                          <button
                            onClick={() => handleReturnRental(rental.productId)}
                            className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                          >
                            Confirm Return
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {rental.isReturned && (
                  <p className="mt-4 font-semibold text-green-500">Rental returned successfully!</p>
                )}
              </div>
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
