/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Custom Icons
const currentListingIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const nearbyListingIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535239.png',
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -26],
});

export default function ListingMap({ listing = {}, nearbyListings = [] }) {
  const mapRef = useRef();
  const [satelliteView, setSatelliteView] = useState(false);

  useEffect(() => {
    if (!listing?.latitude || !listing?.longitude) {
      console.warn('🛑 Missing coordinates');
    }

    setTimeout(() => {
      const leafletContainer = document.querySelector('.leaflet-container');
      if (!leafletContainer || leafletContainer.clientHeight === 0) {
        console.error('🛑 Leaflet map container issue');
      }
    }, 1000);
  }, [listing]);

  if (!listing?.latitude || !listing?.longitude) {
    return (
      <div className="mt-10 h-[300px] sm:h-[400px] w-full rounded-xl border-2 border-dashed border-red-400 bg-red-50 flex items-center justify-center shadow-inner px-4">
        <p className="text-red-700 font-semibold text-lg flex gap-2 items-center text-center">
          ⚠️ Location not available for this listing.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className=" w-full rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/10 border border-white/10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2b2b2b]  p-4 sm:p-6 border-b border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#C8A76F] flex  items-center gap-2">
            🗺️ Location Overview
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Explore the area and switch to satellite view if needed.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#C8A76F]">🛰 Satellite</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={satelliteView}
              onChange={() => setSatelliteView(!satelliteView)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#E8DCC0] rounded-full peer peer-checked:bg-[#332217] transition-all duration-300"></div>
            <div className="absolute left-1 top-1 bg-[#C8A76F] w-4 h-4 rounded-full transition-transform duration-300 transform peer-checked:translate-x-5 pointer-events-none"></div>
          </label>
        </div>
      </div>

      {/* Map */}
      <div className="h-[300px] sm:h-[450px] w-full">
        <MapContainer
          center={[listing.latitude, listing.longitude]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url={
              satelliteView
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
            attribution={
              satelliteView
                ? 'Tiles &copy; Esri'
                : '&copy; OpenStreetMap contributors'
            }
          />

          <Marker
            position={[listing.latitude, listing.longitude]}
            icon={currentListingIcon}
          >
            <Popup>
              <strong>{listing.title}</strong>
              <br />
              This is the main listing
            </Popup>
          </Marker>

          {nearbyListings.map((l) => (
            <Marker
              key={l._id}
              position={[l.latitude, l.longitude]}
              icon={nearbyListingIcon}
            >
              <Popup>
                <strong>{l.title}</strong>
                <br />
                {l.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
}
