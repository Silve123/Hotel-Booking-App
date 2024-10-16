// src/components/BookingSlip.js

const BookingSlip = ({ selectedRoom, selectedDates, calculateSubtotal, calculateTotal }) => {
    return (
        <div className="booking-slip">
            <h3>Booking Slip</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Days</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{selectedRoom?.name}</td>
                        <td>{selectedDates.length}</td>
                        <td>R{selectedRoom?.price.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Subtotal (Excl. Tax):</td>
                        <td>R{calculateSubtotal().toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Tax (15%):</td>
                        <td>R{(calculateSubtotal() * 0.15).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Total (Incl. Tax):</td>
                        <td>R{calculateTotal().toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BookingSlip;
