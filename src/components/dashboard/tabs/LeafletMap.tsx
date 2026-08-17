import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Replicating getStatusColor locally for the map markers to avoid circular dependencies if any
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'online': return '#10b981';
    case 'offline': return '#ef4444';
    case 'travelling': return '#f59e0b';
    case 'work from home': return '#3b82f6';
    case 'meeting': return '#8b5cf6';
    default: return '#6b7280';
  }
};

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically center map when selectedMarker changes
function MapCenterer({ selectedMarker }: { selectedMarker: any }) {
  const map = useMap();
  React.useEffect(() => {
    if (selectedMarker) {
      map.setView([parseFloat(selectedMarker.lat), parseFloat(selectedMarker.lng)], 14, { animate: true });
    }
  }, [selectedMarker, map]);
  return null;
}

interface LeafletMapProps {
  data: any[];
  selectedMarker: any;
  setSelectedMarker: (marker: any) => void;
  setActiveEmployeeModal: (name: string) => void;
}

export default function LeafletMap({ data, selectedMarker, setSelectedMarker, setActiveEmployeeModal }: LeafletMapProps) {
  
  const createCustomIcon = (status: string) => {
    const color = getStatusColor(status).replace('#', '%23');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    return L.divIcon({
      className: 'custom-leaflet-icon',
      html: `<div style="display:flex; justify-content:center; align-items:center; width:32px; height:32px;">${svg}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0 }}>
      <MapContainer 
        center={[12.9716, 77.5946]} 
        zoom={12} 
        style={{ width: '100%', height: '100%', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {data.slice(0, 30).map((emp) => (
          <Marker 
            key={emp.id} 
            position={[parseFloat(emp.lat), parseFloat(emp.lng)]}
            icon={createCustomIcon(emp.status)}
            eventHandlers={{
              click: () => setSelectedMarker(emp),
            }}
          >
            {selectedMarker?.id === emp.id && (
              <Popup>
                <div style={{ color: '#000', width: '220px', margin: '-10px -15px -10px -15px', padding: '16px', background: 'var(--bg-card)' }}>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{selectedMarker.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedMarker.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedMarker.department}</div>
                      </div>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.8rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
                     <div><strong>Status:</strong> {selectedMarker.status}</div>
                     <div><strong>Battery:</strong> {selectedMarker.battery}%</div>
                     <div><strong>Logged:</strong> {selectedMarker.distance}km</div>
                     <div><strong>Check-in:</strong> {selectedMarker.checkIn}</div>
                   </div>
                   <button 
                      className="primary-btn" 
                      style={{ width: '100%', padding: '6px', fontSize: '0.8rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} 
                      onClick={() => setActiveEmployeeModal(selectedMarker.name)}
                    >
                      View Full Profile
                    </button>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        <MapCenterer selectedMarker={selectedMarker} />
      </MapContainer>
    </div>
  );
}
