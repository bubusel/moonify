import React, { useEffect, useState } from 'react';
import { colors } from '../constants/colors';

const LocationControl: React.FC = () => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLat(pos.coords.latitude.toFixed(4));
          setLon(pos.coords.longitude.toFixed(4));
        },
        err => setError(err.message)
      );
    }
  }, []);

  return (
    <div id="location-control" className="flex items-center space-x-2">
      <input
        id="latitude-input"
        aria-label="Latitude"
        value={lat}
        onChange={e => setLat(e.target.value)}
        className="w-20 px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.textPrimary }}
      />
      <input
        id="longitude-input"
        aria-label="Longitude"
        value={lon}
        onChange={e => setLon(e.target.value)}
        className="w-20 px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.textPrimary }}
      />
      <div id="location-error" aria-live="polite" style={{ color: colors.sunsetCrimson }}>{error}</div>
    </div>
  );
};

export default LocationControl;
