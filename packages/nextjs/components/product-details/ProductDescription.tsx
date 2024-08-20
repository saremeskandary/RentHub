"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductDetails.module.scss";
import { ShoppingCart } from "lucide-react";

const ProductDescription: FC<{ id: number; title: string; text: string; img: string } | any> = ({
  id,
  title,
  text,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();

  const hourlyRate = 8;

  useEffect(() => {
    // Set current date and time in the proper format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    const formattedTime = today.toTimeString().slice(0, 5); // HH:MM format

    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  }, []);

  const calculatePrice = () => {
    if (!bookingDate || !bookingTime || !endDate || !endTime) {
      return 0;
    }

    const start = new Date(`${bookingDate}T${bookingTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

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

    if (endDate < bookingDate || (endDate === bookingDate && endTime <= bookingTime)) {
      alert("End date and time cannot be before the start date and time.");
      return;
    }

    const calculatedPrice = calculatePrice();
    setTotalPrice(calculatedPrice);
    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    const rental = {
      productTitle: title,
      productId: id,
      bookingDate,
      bookingTime,
      endDate,
      endTime,
      totalPrice,
    };

    const storedRentals = JSON.parse(localStorage.getItem("rentals") || "[]");
    storedRentals.push(rental);
    localStorage.setItem("rentals", JSON.stringify(storedRentals));

    setIsBooked(true);
    setShowModal(false);

    setTimeout(() => {
      router.push("/myrentals");
    }, 1000);
  };

  return (
    <div className={styles.product_details__description}>
      <div className={styles.product_details__title}>
        <h2>{title}</h2>
        <p>{text}</p>
        <p>Price: ${hourlyRate} per hour</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
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

      <div className="m-2 mb-5 flex flex-1 flex-col items-center justify-center gap-3">
        <label className="w-full text-left font-semibold" htmlFor="bookingDate">
          Start Date
        </label>
        <input
          type="date"
          value={bookingDate}
          min={currentDate}
          onChange={e => setBookingDate(e.target.value)}
          name="bookingDate"
          id="bookingDate"
          className="w-full rounded-lg border-2 border-black px-3 py-1"
        />

        <label className="w-full text-left font-semibold" htmlFor="bookingTime">
          Start Time
        </label>
        <input
          type="time"
          value={bookingTime}
          disabled={!bookingDate}
          onChange={e => setBookingTime(e.target.value)}
          name="bookingTime"
          id="bookingTime"
          className="w-full rounded-lg border-2 border-black px-3 py-1"
        />

        <label className="w-full text-left font-semibold" htmlFor="endDate">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          disabled={!bookingDate}
          onChange={e => setEndDate(e.target.value)}
          name="endDate"
          id="endDate"
          className="w-full rounded-lg border-2 border-black px-3 py-1"
        />

        <label className="w-full text-left font-semibold" htmlFor="endTime">
          End Time
        </label>
        <input
          type="time"
          value={endTime}
          disabled={!endDate}
          onChange={e => setEndTime(e.target.value)}
          name="endTime"
          id="endTime"
          className="w-full rounded-lg border-2 border-black px-3 py-1"
        />
      </div>

      <button onClick={handleBooking} disabled={isBooked} className="!bg-green-500 hover:!bg-green-500/85">
        <ShoppingCart size={18} color="#fff" />
        <span>{isBooked ? "Already Booked" : "Initiate rental"}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">{title}</h2>
            <p className="mb-4 text-gray-700">{text}</p>
            <div className="mb-4">
              <p>
                <strong>Start Date:</strong> {bookingDate}
              </p>
              <p>
                <strong>Start Time:</strong> {bookingTime}
              </p>
              <p>
                <strong>End Date:</strong> {endDate}
              </p>
              <p>
                <strong>End Time:</strong> {endTime}
              </p>
              <p>
                <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
              </p>{" "}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
