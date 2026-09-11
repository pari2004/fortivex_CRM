import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Search, MapPin } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BusinessLead } from '@/lib/data/mockData';

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map component for location selection
function LocationPickerMap({ lat, lng, onLocationChange }: { lat: number, lng: number, onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker position={[lat, lng]} />
  );
}

interface EditBusinessModalProps {
  businessId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PRIORITIES = ["Very High", "High", "Medium", "Low", "Very Low"];
const INDUSTRIES = ['Education', 'Technology', 'Healthcare', 'Finance', 'Consulting', 'Retail', 'Other'];

export function EditBusinessModal({ businessId, onClose, onSuccess }: EditBusinessModalProps) {
  const { businessLeads, updateBusinessLead } = useCRM();
  const [originalBusiness, setOriginalBusiness] = useState<BusinessLead | null>(null);
  const [formData, setFormData] = useState<Partial<BusinessLead & { lat?: number, lng?: number }>>({});
  
  // Dropdown states
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [businessSearch, setBusinessSearch] = useState('');
  
  const businessDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const business = businessLeads.find(b => b.id === businessId);
    if (business) {
      setOriginalBusiness(business);
      // Try to parse lat/lng from the business if it exists, otherwise use a default (e.g. Bangalore)
      const lat = (business as any).lat ? parseFloat((business as any).lat) : 12.9716;
      const lng = (business as any).lng ? parseFloat((business as any).lng) : 77.5946;
      
      let website = business.website || '';
      if (website && !website.startsWith('http')) {
        website = `https://${website}`;
      } else if (!website) {
        website = 'https://';
      }

      setFormData({
        ...business,
        website,
        lat,
        lng
      });
      setBusinessSearch(business.name);
    }
  }, [businessId, businessLeads]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (businessDropdownRef.current && !businessDropdownRef.current.contains(event.target as Node)) setIsBusinessDropdownOpen(false);
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) setIsPriorityDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    if (originalBusiness) {
      const lat = (originalBusiness as any).lat ? parseFloat((originalBusiness as any).lat) : 12.9716;
      const lng = (originalBusiness as any).lng ? parseFloat((originalBusiness as any).lng) : 77.5946;
      
      let website = originalBusiness.website || '';
      if (website && !website.startsWith('http')) {
        website = `https://${website}`;
      } else if (!website) {
        website = 'https://';
      }

      setFormData({
        ...originalBusiness,
        website,
        lat,
        lng
      });
      setBusinessSearch(originalBusiness.name);
    }
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      alert("Business Name is required.");
      return;
    }

    const updateData = { ...originalBusiness, ...formData } as BusinessLead;
    if (updateData.website === 'https://') {
      updateData.website = '';
    }

    updateBusinessLead(updateData);
    onSuccess();
    onClose();
  };

  useGlobalEscape(true, () => onClose());

  const filteredBusinesses = businessLeads.filter(b => b.name.toLowerCase().includes(businessSearch.toLowerCase()));

  if (!originalBusiness) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.95, opacity: 0 }} 
        style={{ 
          background: 'var(--bg-primary)', 
          padding: '0', 
          borderRadius: '16px', 
          width: '100%', 
          maxWidth: '550px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Editing Business</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', color: 'var(--text-tertiary)' }} className="hover-bg-secondary">
            <X size={18} />
          </button>
        </div>
        
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Business Selector */}
          <div ref={businessDropdownRef} style={{ position: 'relative' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Search for business or add manually</label>
            <div 
              style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)', padding: '0 12px' }}
              onClick={() => setIsBusinessDropdownOpen(true)}
            >
              <input 
                type="text" 
                value={businessSearch} 
                onChange={(e) => {
                  setBusinessSearch(e.target.value);
                  setFormData({ ...formData, name: e.target.value });
                  setIsBusinessDropdownOpen(true);
                }}
                className="form-input"
                style={{ border: 'none', background: 'transparent', padding: '12px 0', marginTop: 0 }}
                placeholder="Search business..."
              />
              <ChevronDown size={16} color="var(--text-secondary)" />
            </div>
            
            <AnimatePresence>
              {isBusinessDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '200px', overflowY: 'auto' }}
                >
                  {filteredBusinesses.map(b => (
                    <div 
                      key={b.id}
                      onClick={() => {
                        setBusinessSearch(b.name);
                        setFormData({ ...formData, name: b.name });
                        setIsBusinessDropdownOpen(false);
                      }}
                      className="hover-bg-secondary"
                      style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                    >
                      {b.name}
                    </div>
                  ))}
                  {filteredBusinesses.length === 0 && (
                    <div style={{ padding: '10px 16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No businesses found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Business Website */}
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Enter business website</label>
            <input 
              type="url" 
              name="website" 
              value={formData.website || 'https://'} 
              onChange={handleChange} 
              className="form-input" 
              style={{ marginTop: 0 }}
            />
          </div>

          {/* Industry */}
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Industry it belongs to</label>
            <select 
              name="industry" 
              value={formData.industry || ''} 
              onChange={handleChange} 
              className="form-input"
              style={{ marginTop: 0 }}
            >
              <option value="">Select Industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          {/* Priority */}
          <div ref={priorityDropdownRef} style={{ position: 'relative' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Select the priority</label>
            <div 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)', padding: '12px 16px', cursor: 'pointer' }}
              onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
            >
              <span style={{ fontSize: '0.95rem', color: formData.priority ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {formData.priority || 'Select Priority'}
              </span>
              <ChevronDown size={16} color="var(--text-secondary)" />
            </div>
            
            <AnimatePresence>
              {isPriorityDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50 }}
                >
                  {PRIORITIES.map(p => (
                    <div 
                      key={p}
                      onClick={() => {
                        setFormData({ ...formData, priority: p });
                        setIsPriorityDropdownOpen(false);
                      }}
                      className="hover-bg-secondary"
                      style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                    >
                      {p}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Address */}
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Select Business Address</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)', padding: '0 12px' }}>
              <MapPin size={16} color="var(--text-secondary)" />
              <input 
                type="text" 
                name="address" 
                value={formData.address || ''} 
                onChange={handleChange} 
                className="form-input" 
                style={{ border: 'none', background: 'transparent', padding: '12px 10px', marginTop: 0 }}
                placeholder="Enter Address"
              />
            </div>
          </div>

          {/* Map */}
          <div style={{ height: '200px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <MapContainer 
              center={[formData.lat || 12.9716, formData.lng || 77.5946]} 
              zoom={13} 
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPickerMap 
                lat={formData.lat || 12.9716} 
                lng={formData.lng || 77.5946} 
                onLocationChange={(lat, lng) => setFormData({ ...formData, lat, lng })}
              />
            </MapContainer>
          </div>

        </div>
        
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <button onClick={handleReset} className="secondary-btn" style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
            Reset
          </button>
          <button onClick={handleSave} className="primary-btn" style={{ padding: '10px 32px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }}>
            Submit
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .form-input {
            width: 100%;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid var(--glass-border);
            background: var(--bg-primary);
            font-size: 0.95rem;
            margin-top: 8px;
            outline: none;
            transition: all 0.2s;
            color: var(--text-primary);
          }
          .form-input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          }
          .form-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
          }
        `}} />
      </motion.div>
    </div>
  );
}
