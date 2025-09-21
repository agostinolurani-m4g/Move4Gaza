import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import 'leaflet-gpx';

function GPXTrack({ src }) {
  const map = useMap();

  useEffect(() => {
    if (!src || !map) return;
    const gpx = new window.L.GPX(src, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null,
      },
    });
    gpx.on('loaded', function(e) {
      map.fitBounds(e.target.getBounds());
    });
    gpx.addTo(map);
    return () => {
      map.eachLayer((layer) => {
        if (layer instanceof window.L.GPX) map.removeLayer(layer);
      });
    };
  }, [src, map]);

  return null;
}

const GPXMap = ({ src }) => {
  if (!src) return <p>Nessuna traccia GPX disponibile.</p>;
  return (
    <div
      className="relative z-0"
      style={{ height: 400, width: '100%', borderRadius: 16, overflow: 'hidden' }}
    >
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={[45.4642, 9.19]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GPXTrack src={src} />
      </MapContainer>
    </div>
  );
};

export default GPXMap;