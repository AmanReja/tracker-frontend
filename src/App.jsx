import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Geolocation from "./Components/Geolocation";
const App = () => {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io("https://tracker-backend-ztt5.onrender.com");

    setSocket(socketIo);

    socketIo.on("welcome", (message) => {
      setMessage(message);
    });

    // Cleanup socket connection on component unmount
    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <>
      <h1>Socket.IO MAP</h1>
      {message && <p>{message}</p>} {/* Display message from backend */}
      <Geolocation></Geolocation>
    </>
  );
};

export default App;
