// src/components/RoomCard.js
import './styling/RoomCard.scss';


const RoomCard = ({ room, selectedRoom, setSelectedRoom }) => {
    return (
        <div
            className={`room-card ${selectedRoom?.id === room.id ? 'selected' : ''}`}
            onClick={() => setSelectedRoom(room)}
        >
            <h3 className="room-name">{room.name}</h3>
            <p className="room-price">R{room.price}/night</p>
            
            {/* Add description */}
            <p className="room-description">{room.description}</p>

            {/* Add features */}
            <div className="room-features">
                {room.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                        {feature}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomCard;
