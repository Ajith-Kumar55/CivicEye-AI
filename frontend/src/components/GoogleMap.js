import React, { useState, useEffect } from "react";

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


// =====================================
// MAP CLICK
// =====================================

function MapClickHandler({ setPosition }) {

  useMapEvents({

    click(e) {

      setPosition([
        e.latlng.lat,
        e.latlng.lng,
      ]);

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
}) {

  const [position, setPosition] = useState([
    12.9716,
    77.5946,
  ]);

  const [moveMap, setMoveMap] =
    useState(false);


  // =====================================
  // LOCATION FROM COMPLAINT SEARCH
  // =====================================

  useEffect(() => {

    if (
      selectedLocation &&
      selectedLocation.lat !== undefined &&
      selectedLocation.lng !== undefined
    ) {

      const newPosition = [
        Number(selectedLocation.lat),
        Number(selectedLocation.lng),
      ];

      setPosition(newPosition);

      setMoveMap(true);

      setTimeout(() => {
        setMoveMap(false);
      }, 1500);

    }

  }, [selectedLocation]);


  // =====================================
  // CURRENT GPS LOCATION
  // =====================================

  const getLocation = () => {

    if (!navigator.geolocation) {

      alert(
        "Geolocation is not supported by this browser."
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (pos) => {

        const newPosition = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        setPosition(newPosition);

        setMoveMap(true);

        setTimeout(() => {
          setMoveMap(false);
        }, 1500);

      },

      (error) => {

        console.log(error);

        alert(
          "Unable to get your current location. Please allow location permission."
        );

      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }

    );

  };


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

          Get Current Location

        </button>

      </div>


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

              setPosition([
                latLng.lat,
                latLng.lng,
              ]);

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