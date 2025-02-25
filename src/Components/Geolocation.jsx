import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";

// Fix default marker issue in Leaflet
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const position = [22.683649, 88.651443];

const socket = io("https://tracker-backend-h5yl.onrender.com"); // Connect to your server

const Geolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setLocation(newLocation);

          // Emit the geolocation to the server
          socket.emit("geolocation", newLocation);
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 500
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }

    // Optional: Listen for server responses or updates (e.g., location updates)
    socket.on("location-update", (data) => {
      console.log("Location update from server:", data);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("location-update");
    };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <h2>📍 Your Current Location</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {location ? (
        <MapContainer
          center={[location.lat, location.lon]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <Marker position={position}></Marker>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
};

export default Geolocation;
