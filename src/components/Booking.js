import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import RoomCard from "./RoomCard"; // Import RoomCard component
import BookingSlip from "./BookingSlip"; // Import BookingSlip component
import CalendarContainer from "./CalendarContainer"; // Import CalendarContainer component
import './styling/Booking.scss';

const Booking = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookedDates, setBookedDates] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomsCollectionRef = collection(db, "rooms");
                const roomsCollection = await getDocs(roomsCollectionRef);
                setRooms(roomsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        const fetchBookedDates = async () => {
            if (!selectedRoom) return;
            try {
                const bookingsCollectionRef = collection(db, "bookings");
                const q = query(bookingsCollectionRef, where("roomId", "==", selectedRoom.id));
                const bookingsCollection = await getDocs(q);
                const dates = bookingsCollection.docs.map(doc => doc.data().bookingDate);
                setBookedDates(dates);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookedDates();
    }, [selectedRoom]);

    const handleBooking = async () => {
        const user = auth.currentUser;
        if (user && selectedRoom && selectedDates.length > 0) {
            try {
                await Promise.all(selectedDates.map(date => {
                    const formattedDate = date.toLocaleDateString(); // Use toLocaleDateString for proper formatting
                    return addDoc(collection(db, "bookings"), {
                        userId: user.uid,
                        roomId: selectedRoom.id,
                        bookingDate: formattedDate,
                    });
                }));
                alert("Room booked successfully!");
                setSelectedRoom(null);
                setSelectedDates([]);
                setBookedDates([]);
            } catch (error) {
                alert("Error booking room: " + error.message);
            }
        } else {
            alert("Please select a room and at least one date.");
        }
    };
    
    const handleDateChange = (date) => {
        if (Array.isArray(date)) {
            const [start, end] = date;
            const datesArray = [];
    
            // Properly iterate and include the last date in the selection
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                datesArray.push(new Date(d));
            }
    
            setSelectedDates(datesArray);
        } else {
            setSelectedDates([date]);
        }
    };
    
    const isBooked = (date) => {
        return bookedDates.some(bookedDate => new Date(bookedDate).toDateString() === date.toDateString())
            ? 'booked'
            : null;
    };

    const handleClear = () => {
        setSelectedDates([]);
    };

    const calculateSubtotal = () => {
        if (selectedRoom && selectedDates.length > 0) {
            return selectedRoom.price * selectedDates.length;
        }
        return 0;
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal + subtotal * 0.15;
    };

    return (
        <div className="booking-container">
            <h2 className="booking-title">Book a Room</h2>
            <div className="room-cards">
                {rooms.map(room => (
                    <RoomCard 
                        key={room.id} 
                        room={room} 
                        selectedRoom={selectedRoom} 
                        setSelectedRoom={setSelectedRoom} 
                    />
                ))}
            </div>

            {selectedRoom && (
                <div className="booking-details-container">
                    <div className="booking-details">
                        <CalendarContainer 
                            handleDateChange={handleDateChange}
                            selectedDates={selectedDates}
                            isBooked={isBooked}
                        />
                        <BookingSlip 
                            selectedRoom={selectedRoom} 
                            selectedDates={selectedDates} 
                            calculateSubtotal={calculateSubtotal} 
                            calculateTotal={calculateTotal} 
                        />
                    </div>
                    <div className="button-container">
                        <button onClick={handleBooking} className="booking-button">
                            Book Now
                        </button>
                        <button onClick={handleClear} className="clear-button">
                            Clear Dates
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
