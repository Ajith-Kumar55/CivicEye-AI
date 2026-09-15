import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import {
  FaMapMarkerAlt,
  FaLocationArrow,
} from "react-icons/fa";

// Fix Leaflet marker 404 image errors
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


// =====================================
// MAP CLICK
// =====================================

function MapClickHandler({ setPosition, onLocationSelect }) {

  useMapEvents({

    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPosition([lat, lng]);
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    },

  });

  return null;
}


// =====================================
// MAP CONTROLLER
// =====================================

function MapController({ position, moveMap }) {

  const map = useMap();

  useEffect(() => {

    if (moveMap) {

      map.flyTo(
        position,
        17,
        {
          animate: true,
          duration: 1.2,
        }
      );

    }

  }, [moveMap, position, map]);

  return null;
}


// =====================================
// GOOGLE MAP
// =====================================

function GoogleMap({
  history = [],
  selectedLocation,
  onLocationSelect,
}) {

  const [position, setPosition] = useState([
    12.9716,
    77.5946,
  ]);

  const [moveMap, setMoveMap] = useState(false);
  const [locationError, setLocationError] = useState("");

  const updatePosition = (lat, lng, shouldMove = false) => {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    setPosition([latNum, lngNum]);

    if (shouldMove) {
      setMoveMap(true);
      setTimeout(() => {
        setMoveMap(false);
      }, 1500);
    }

    if (onLocationSelect) {
      onLocationSelect(latNum, lngNum);
    }
  };

  // =====================================
  // CURRENT GPS LOCATION
  // =====================================

  const getLocation = () => {

    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Unable to access your current location. Please allow location access or select the location manually on the map."
      );
      return;
    }


    navigator.geolocation.getCurrentPosition(

      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocationError("");
        updatePosition(lat, lng, true);

      },

      (error) => {

        setLocationError(
          "Unable to access your current location. Please allow location access or select the location manually on the map."
        );

      },

      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }

    );

  };

  // Request location on initialization
  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================
  // LOCATION FROM COMPLAINT SEARCH
  // =====================================

  useEffect(() => {

    if (
      selectedLocation &&
      selectedLocation.lat !== undefined &&
      selectedLocation.lng !== undefined
    ) {

      updatePosition(selectedLocation.lat, selectedLocation.lng, true);

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);


  // =====================================
  // HISTORY MARKERS
  // =====================================

  const complaints = history
    .map((item, index) => {

      if (
        item.latitude !== undefined &&
        item.longitude !== undefined
      ) {

        return {

          id: `CEV-${1001 + index}`,

          issue: item.issue,

          confidence:
            item.confidence,

          status:
            item.status,

          priority:
            item.severity,

          position: [
            Number(item.latitude),
            Number(item.longitude),
          ],

        };

      }

      return null;

    })
    .filter(Boolean);


  return (

    <div
      style={{
        background:
          "linear-gradient(145deg,#0f172a,#1e293b,#334155)",

        borderRadius: "22px",

        padding: "30px",

        color: "white",

        marginTop: "35px",

        boxShadow:
          "0 12px 30px rgba(0,0,0,.30)",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "25px",
        }}
      >

        <h2
          style={{
            margin: 0,
            color: "#38bdf8",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >

          <FaMapMarkerAlt />

          Smart Complaint Location

        </h2>


        <button
          onClick={getLocation}
          style={{
            background: "#06b6d4",
            color: "white",
            border: "none",
            padding: "12px 22px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "600",
          }}
        >

          <FaLocationArrow />

          Use Current Location

        </button>

      </div>


      {/* LOCATION ERROR BANNER */}

      {locationError && (
        <div
          style={{
            background: "#7f1d1d",
            border: "1px solid #ef4444",
            color: "#fca5a5",
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center"
          }}
        >
          ⚠️ {locationError}
        </div>
      )}


      {/* COORDINATES */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >

        <div
          style={{
            background: "#334155",
            padding: "18px",
            borderRadius: "15px",
          }}
        >

          <h4
            style={{
              color: "#38bdf8",
              marginTop: 0,
            }}
          >
            Latitude
          </h4>

          <p
            style={{
              fontSize: "18px",
              marginBottom: 0,
            }}
          >
            {position[0].toFixed(6)}
          </p>

        </div>


        <div
          style={{
            background: "#334155",
            padding: "18px",
            borderRadius: "15px",
          }}
        >

          <h4
            style={{
              color: "#38bdf8",
              marginTop: 0,
            }}
          >
            Longitude
          </h4>

          <p
            style={{
              fontSize: "18px",
              marginBottom: 0,
            }}
          >
            {position[1].toFixed(6)}
          </p>

        </div>

      </div>


      {/* MAP */}

      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={true}

        style={{
          height: "450px",
          width: "100%",
          borderRadius: "20px",
        }}
      >

        <MapClickHandler
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />


        <MapController
          position={position}
          moveMap={moveMap}
        />


        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />


        {/* SELECTED LOCATION */}

        <Marker
          position={position}
          draggable={true}

          eventHandlers={{

            dragend: (event) => {

              const marker =
                event.target;

              const latLng =
                marker.getLatLng();

              updatePosition(latLng.lat, latLng.lng, false);

            },

          }}
        >

          <Popup>

            <b>
              📍 Selected Location
            </b>

            <br />

            Latitude:
            {" "}
            {position[0].toFixed(6)}

            <br />

            Longitude:
            {" "}
            {position[1].toFixed(6)}

          </Popup>

        </Marker>


        {/* HISTORY */}

        {complaints.map((item) => (

          <Marker
            key={item.id}
            position={item.position}
          >

            <Popup>

              <b>
                📍 {item.id}
              </b>

              <p>
                <b>Issue:</b>{" "}
                {item.issue}
              </p>

              <p>
                <b>Confidence:</b>{" "}
                {item.confidence}
              </p>

              <p>
                <b>Status:</b>{" "}
                {item.status}
              </p>

            </Popup>

          </Marker>

        ))}

      </MapContainer>


      <p
        style={{
          textAlign: "center",
          color: "#94a3b8",
          marginTop: "15px",
          lineHeight: "1.7",
        }}
      >
        📍 Click the map or drag the marker
        to choose a location.
      </p>

    </div>

  );

}

export default GoogleMap;