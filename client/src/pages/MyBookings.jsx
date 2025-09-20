import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { dateFormat } from "../lib/dateFormat";
import timeFormat from "../lib/timeFormat.js";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; // Add this import

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user, image_base_url } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success && Array.isArray(data.bookings)) {
        // Filter out invalid bookings
        const validBookings = data.bookings.filter(booking => 
          booking?.show?.movie && 
          booking.bookedSeats &&
          booking._id
        );
        setBookings(validBookings);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error loading bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="600px" />
      <BlurCircle bottom="0px" left="600px" />
      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">No bookings found</div>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
          >
            <div className="flex flex-col md:flex-row">
              {booking.show?.movie?.poster_path && (
                <img
                  src={image_base_url + booking.show.movie.poster_path}
                  alt={booking.show.movie.title || 'Movie poster'}
                  className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
                />
              )}
              <div className="flex flex-col p-4">
                <p className="text-lg font-semibold">
                  {booking.show?.movie?.title || 'Unknown Movie'}
                </p>
                {booking.show?.movie?.runtime && (
                  <p className="text-gray-400 text-sm">
                    {timeFormat(booking.show.movie.runtime)}
                  </p>
                )}
                {booking.show?.showDateTime && (
                  <p className="text-gray-400 text-sm mt-auto">
                    {dateFormat(booking.show.showDateTime)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:items-end md:text-right justify-between p-4">
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold mb-3">
                  {currency}
                  {booking.amount || 0}
                </p>
                {!booking.isPaid && booking.paymentStatus !== "completed" && booking.paymentLink && (
                  <Link
                    to={booking.paymentLink}
                    className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    Pay Now
                  </Link>
                )}
                {(booking.isPaid || booking.paymentStatus === "completed") && (
                  <span className="text-green-500 text-sm font-medium">Paid</span>
                )}
              </div>

              <div className="text-sm">
                <p>
                  <span className="text-gray-400">Total Tickets:</span>{" "}
                  {booking.bookedSeats?.length || 0}
                </p>
                <p>
                  <span className="text-gray-400">Seat Number:</span>{" "}
                  {booking.bookedSeats?.join(", ") || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;