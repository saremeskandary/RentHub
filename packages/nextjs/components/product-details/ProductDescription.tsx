"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserProfile from "./UserProfile";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CircleUserRound, ShoppingCart } from "lucide-react";
import { useAccount, useSendTransaction } from "wagmi";

const ProductDescription: FC<
  | {
      title: string;
      text: string;
      id: number;
    }
  | any
> = ({ title, text, id }) => {
  const [showModal, setShowModal] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totalBPrice, setTotalBPrice] = useState(0);
  const [totalLPrice, setTotalLPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const router = useRouter();

  const hourlyRate = 5;
  const hourlyBRate = 0.000081;
  const hourlyLRate = 0.079;

  const { isConnected, address } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const handleSend = () => {
    if (isConnected && address) {
      try {
        const tx = {
          to: "0x97C13a6517b4a9cA752638EeeCC2ea257c174792",
          value: BigInt("10"),
        };

        const txHash = sendTransaction(tx);
        alert(`Success!`);

        return txHash;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const [rating, setRating] = useState(3);
  const [comments, setComments] = useState([
    { user: "Michale", message: "Great post!" },
    { user: "Alex", message: "Thanks for sharing!" },
    { user: "Alice", message: "Interesting read!" },
  ]);

  useEffect(() => {
    if (showModal || isPopupOpen) document.body.classList.add("lock");
    else document.body.classList.remove("lock");
  }, [showModal, isPopupOpen]);

  useEffect(() => {
    // Set current date and time in the proper format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    const formattedTime = today.toTimeString().slice(0, 5); // HH:MM format

    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  }, []);

  const calculatePrice = (rate: number) => {
    if (!bookingDate || !bookingTime || !endDate || !endTime) {
      return 0;
    }

    const start = new Date(`${bookingDate}T${bookingTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours

    // Ensure the duration is positive
    if (durationInHours > 0) {
      return durationInHours * rate;
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

    setTotalPrice(calculatePrice(hourlyRate));
    setTotalBPrice(calculatePrice(hourlyBRate));
    setTotalLPrice(calculatePrice(hourlyLRate));

    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    try {
      handleSend();

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
    } catch (error) {
      alert("Failed to send transaction. Please try again.");
    }
  };

  return (
    <div className="flex flex-[0_1_45%] flex-col p-5">
      <div className="mb-3">
        <h2 className="mb-4 text-lg font-semibold leading-5">{title}</h2>
        <p className="text-sm">{text}</p>

        <div className="my-4">
          <p className="flex flex-wrap gap-[6px] gap-y-0 font-semibold">
            Price: ${hourlyRate} -
            <span className="flex items-center">
              <Image src="/btc-logo.png" alt="xfi" width={15} height={15} /> BTC {hourlyBRate}
            </span>
            -
            <span className="flex items-center">
              <Image src="/ltc-logo.png" alt="xfi" width={15} height={15} /> LTC {hourlyLRate}
            </span>
            (per hour)
          </p>
          <p className="flex flex-wrap gap-[6px] gap-y-0 font-semibold">
            Total Price: ${totalPrice.toFixed(2)} -
            <span className="flex items-center">
              <Image src="/btc-logo.png" alt="xfi" width={15} height={15} /> BTC {totalBPrice.toFixed(4)}
            </span>
            -
            <span className="flex items-center">
              <Image src="/ltc-logo.png" alt="xfi" width={15} height={15} /> LTC {totalLPrice.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      <div className="relative mb-7">
        <UserProfile
          comments={comments}
          setComments={setComments}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          rating={rating}
          setRating={setRating}
        />

        <button onClick={() => setIsPopupOpen(true)} className="flex items-center gap-7">
          <div className="flex items-center gap-2">
            <CircleUserRound color="#4f4f4f" />
            <span className="text-base font-semibold">Alex Ford</span>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`mr-[2px] text-xl text-[#ffc107] ${i > rating ? "text-gray-300" : ""}`}>
                ★
              </span>
            ))}
            <p className="ml-1">({comments.length})</p>
          </div>
        </button>
      </div>

      <div className="mb-7 flex gap-5">
        <span className="flex items-center gap-1 font-semibold">
          <label htmlFor="radio1">New</label>
          <input className="cheked-input" type="radio" id="radio1" name="option" disabled />
        </span>

        <span className="flex items-center gap-1 font-semibold">
          <label htmlFor="radio2">Used</label>
          <input className="cheked-input" type="radio" id="radio2" name="option" disabled checked />
        </span>
      </div>

      <div className="m-2 mb-5 flex flex-col items-center justify-center gap-3">
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

      <button
        onClick={handleBooking}
        disabled={isBooked}
        className="mt-auto flex w-full items-center justify-center gap-3 rounded bg-green-500 px-5 py-3 text-white transition-colors hover:bg-green-600"
      >
        <ShoppingCart size={18} color="#fff" />
        <span>{isBooked ? "Already Booked" : "Initiate rental"}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 px-3 py-20">
          <div className="w-full max-w-[500px] rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">{title}</h2>
            <p className="mb-4 text-gray-700">{text}</p>
            <div className="mb-4">
              <p>
                <strong>Deposit:</strong> $75.00
              </p>
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
              <p className="flex flex-wrap items-center gap-[5px] gap-y-0">
                <strong>Total Price: </strong> ${totalPrice.toFixed(2)} -
                <span className="flex items-center">
                  <Image src="/btc-logo.png" alt="xfi" width={15} height={15} /> BTC {totalBPrice.toFixed(4)}
                </span>
                -
                <span className="flex items-center">
                  <Image src="/ltc-logo.png" alt="xfi" width={15} height={15} /> LTC {totalLPrice.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="flex gap-2 md4:flex-col">
              <button
                onClick={() => setShowModal(false)}
                className="rounded !bg-red-400 px-4 py-2 text-gray-700 hover:!bg-red-500"
              >
                Cancel
              </button>
              {isConnected ? (
                <button
                  onClick={handleConfirmBooking}
                  className="rounded !bg-green-500 px-4 py-2 text-white hover:!bg-green-600"
                >
                  Confirm Booking
                </button>
              ) : (
                <div className="w-full max-w-[320px] md4:max-w-full">
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => {
                      return (
                        <>
                          {(() => {
                            return (
                              <button onClick={openConnectModal} type="button">
                                Connect Wallet
                              </button>
                            );
                          })()}
                        </>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
