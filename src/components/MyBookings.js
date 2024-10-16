import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"; // Firestore functions
import './styling/MyBookings.scss'; // SCSS for styling

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  // Helper function to check if two dates are consecutive
  const areDatesConsecutive = (date1, date2) => {
    const diffTime = new Date(date2).getTime() - new Date(date1).getTime();
    return diffTime === 86400000; // 1 day in milliseconds
  };

  // Helper function to merge consecutive bookings
  const mergeConsecutiveBookings = (bookings) => {
    if (bookings.length === 0) return [];

    // Sort bookings by roomId and booking date
    const sortedBookings = bookings.sort((a, b) => {
      if (a.roomId !== b.roomId) {
        return a.roomId.localeCompare(b.roomId);
      }
      return new Date(a.bookingDate) - new Date(b.bookingDate);
    });

    const mergedBookings = [];
    let currentRange = {
      start: sortedBookings[0].bookingDate,
      end: sortedBookings[0].bookingDate,
      roomId: sortedBookings[0].roomId,
    };

    for (let i = 1; i < sortedBookings.length; i++) {
      const currentBooking = sortedBookings[i];

      if (
        currentRange.roomId === currentBooking.roomId &&
        areDatesConsecutive(currentRange.end, currentBooking.bookingDate)
      ) {
        // If consecutive and for the same room, extend the range
        currentRange.end = currentBooking.bookingDate;
      } else {
        // If not consecutive or different room, push the current range and start a new range
        mergedBookings.push(currentRange);
        currentRange = {
          start: currentBooking.bookingDate,
          end: currentBooking.bookingDate,
          roomId: currentBooking.roomId,
        };
      }
    }
    mergedBookings.push(currentRange); // Push the final range
    return mergedBookings;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const user = auth.currentUser; // Get current user
      if (user) {
        try {
          const bookingsCollectionRef = collection(db, "bookings");
          const q = query(bookingsCollectionRef, where("userId", "==", user.uid)); // Query for user bookings
          const bookingsSnapshot = await getDocs(q);
          const bookingsData = bookingsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Merge consecutive bookings
          const mergedBookings = mergeConsecutiveBookings(bookingsData);

          // Fetch room names
          const bookingsWithRoomNames = await Promise.all(
            mergedBookings.map(async (booking) => {
              const roomDocRef = doc(db, "rooms", booking.roomId); // Query the rooms collection using roomId
              const roomDoc = await getDoc(roomDocRef);
              const roomName = roomDoc.exists() ? roomDoc.data().name : "Unknown Room";
              return { ...booking, roomName };
            })
          );

          setBookings(bookingsWithRoomNames);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="my-bookings-container">
      <h2 className="my-bookings-title">My Bookings</h2>
      {bookings.length > 0 ? (
        <ul className="my-bookings-list">
          {bookings.map((booking, index) => (
            <li key={index} className="booking-item">
              <p>Room: {booking.roomName}</p>
              <p>
                Booking Date: {booking.start} to {booking.end}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookings;
