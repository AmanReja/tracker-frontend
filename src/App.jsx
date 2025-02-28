import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Geolocation from "./Components/Geolocation";
const App = () => {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io("https://tracker-backend-1-l7gv.onrender.com");

    setSocket(socketIo);

    socketIo.on("welcome", (message) => {
      setMessage(message);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <>
      <h1>Socket.IO MAP</h1>
      {message && <p>{message}</p>}
      <Geolocation></Geolocation>
    </>
  );
};

export default App;
