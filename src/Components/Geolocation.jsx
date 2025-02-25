import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const socket = io("https://tracker-backend-ztt5.onrender.com");

const Geolocation = () => {
  const [location, setLocation] = useState(null);
  const [allLocations, setAllLocations] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLocation);
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

    socket.on("receive-location", (data) => {
      console.log("All active users' locations:", data);
      setAllLocations(data);
    });

    return () => {
      socket.off("receive-location");
    };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <h2>📍 Live Visitors' Locations</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {location ? (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={10}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {Object.entries(allLocations).map(([id, loc]) => (
            <React.Fragment key={id}>
              <Marker position={[loc.lat, loc.lng]} icon={customIcon}>
                <Popup>User: {id}</Popup>
              </Marker>
              <Circle
                center={[loc.lat, loc.lng]}
                radius={500}
                pathOptions={{
                  color: "blue",
                  fillColor: "blue",
                  fillOpacity: 0.2
                }}
              />
            </React.Fragment>
          ))}
        </MapContainer>
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
};

export default Geolocation;
