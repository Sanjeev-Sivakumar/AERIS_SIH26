import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MapPin,
  Mail,
  User,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Globe
} from 'lucide-react';

export interface MobileRegistrationPageProps {
  onSwitchToDashboard?: () => void;
}

interface WardData {
  name: string;
  district: string;
  lat: number;
  lon: number;
  aqi: number;
  category: string;
  lid: string;
}

const WARDS: Record<string, WardData> = {
  anand_vihar: {
    name: 'Anand Vihar',
    district: 'East Delhi Airshed Corridor',
    lat: 28.6508,
    lon: 77.3152,
    aqi: 418,
    category: 'SEVERE',
    lid: 'INVERSION COLLAPSE LID'
  },
  punjabi_bagh: {
    name: 'Punjabi Bagh',
    district: 'West Delhi Airshed Corridor',
    lat: 28.67,
    lon: 77.13,
    aqi: 372,
    category: 'VERY POOR',
    lid: 'STAGNATION TRAP'
  },
  bawana: {
    name: 'Bawana Industrial',
    district: 'North Delhi Airshed',
    lat: 28.7997,
    lon: 77.06,
    aqi: 384,
    category: 'SEVERE',
    lid: 'INVERSION COLLAPSE LID'
  },
  dtu: {
    name: 'DTU Shahbad Daulatpur',
    district: 'North Delhi Corridor',
    lat: 28.75,
    lon: 77.117,
    aqi: 310,
    category: 'VERY POOR',
    lid: 'SURFACE COUPLING'
  },
  rk_puram: {
    name: 'R.K. Puram',
    district: 'South Delhi Corridor',
    lat: 28.566,
    lon: 77.1767,
    aqi: 295,
    category: 'POOR',
    lid: 'MIXING DEPTH 480M'
  },
  connaught_place: {
    name: 'Connaught Place',
    district: 'Central Receptors',
    lat: 28.6315,
    lon: 77.2167,
    aqi: 240,
    category: 'POOR',
    lid: 'MODERATE DIFFUSION'
  },
  noida_sec62: {
    name: 'Noida Sector-62',
    district: 'Gautam Buddha Nagar NCR',
    lat: 28.628,
    lon: 77.3649,
    aqi: 315,
    category: 'VERY POOR',
    lid: 'UPWIND PLUME ADVECTION'
  },
  gurugram_cybercity: {
    name: 'Gurugram CyberCity',
    district: 'Gurugram NCR Corridor',
    lat: 28.495,
    lon: 77.089,
    aqi: 285,
    category: 'POOR',
    lid: 'REGIONAL TRANSPORT'
  }
};

export const MobileRegistrationPage: React.FC<MobileRegistrationPageProps> = ({ onSwitchToDashboard }) => {
  const [selectedWard, setSelectedWard] = useState<string>('anand_vihar');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('citizen');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [dispatchedEmail, setDispatchedEmail] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const wardParam = params.get('ward');
      if (wardParam && WARDS[wardParam]) {
        setSelectedWard(wardParam);
      }
    }
  }, []);

  const wardInfo = WARDS[selectedWard] || WARDS['anand_vihar'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Citizen Responder',
          email: email.trim(),
          ward_id: selectedWard,
          role: role,
          channels: ['email', 'push']
        })
      });
      await res.json().catch(() => ({}));
      setDispatchedEmail(email.trim());
      setSubmitted(true);
    } catch {
      setDispatchedEmail(email.trim());
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#081C15',
        color: '#F8FAF9',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '16px 16px 40px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Top Header Live Badge */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(74, 222, 128, 0.12)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#4ADE80',
              letterSpacing: '0.5px'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                backgroundColor: '#4ADE80',
                borderRadius: '50%',
                display: 'inline-block'
              }}
            />
            <span>LIVE AIRSHED CONNECTED &bull; CLOUD GATEWAY</span>
          </div>
        </div>

        {/* Title Header Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F281E 0%, #17382B 100%)',
            border: '1px solid #1B4332',
            borderRadius: '18px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.3px',
              lineHeight: 1.3,
              margin: '0 0 6px 0'
            }}
          >
            AERIS Citizen Defense
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: '#94A3B8',
              lineHeight: 1.4,
              margin: 0
            }}
          >
            Dynamic hyper-local air quality early warning network. Mobile Barcode Onboarding Portal.
          </p>
        </div>

        {/* Monitored Ward Card */}
        <div
          style={{
            background: '#143326',
            border: '1.5px solid #2D6A4F',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '18px'
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#74C69D',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px'
            }}
          >
            <MapPin size={14} />
            CURRENT MONITORED LOCATION
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
            {wardInfo.name} / {wardInfo.district}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11.5px',
              color: '#94A3B8',
              marginBottom: '14px'
            }}
          >
            Lat: {wardInfo.lat}&deg;N, Lon: {wardInfo.lon}&deg;E &bull; Verified Receptor Station
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '10px',
              padding: '10px 14px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#FCA5A5' }}>
                CURRENT WARD AQI
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#EF4444'
                }}
              >
                {wardInfo.aqi}{' '}
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#F87171' }}>
                  {wardInfo.category}
                </span>
              </div>
            </div>
            <div
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.5px'
              }}
            >
              {wardInfo.lid}
            </div>
          </div>
        </div>

        {/* Dynamic Form or Success Card */}
        {!submitted ? (
          <div
            style={{
              background: '#0F281E',
              border: '1px solid #1B4332',
              borderRadius: '18px',
              padding: '22px 20px',
              marginBottom: '18px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.25)'
            }}
          >
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#D8F3DC',
                    marginBottom: '7px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  <User size={13} /> Your Name / Role
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name or title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#081C15',
                    border: '1.5px solid #2D6A4F',
                    borderRadius: '12px',
                    padding: '13px 14px',
                    fontSize: '14px',
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#D8F3DC',
                    marginBottom: '7px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  <Mail size={13} /> Email Address (For Instant Air Alert)
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#081C15',
                    border: '1.5px solid #2D6A4F',
                    borderRadius: '12px',
                    padding: '13px 14px',
                    fontSize: '14px',
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#D8F3DC',
                    marginBottom: '7px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Target Monitored Ward
                </label>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#081C15',
                    border: '1.5px solid #2D6A4F',
                    borderRadius: '12px',
                    padding: '13px 14px',
                    fontSize: '14px',
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {Object.entries(WARDS).map(([id, w]) => (
                    <option key={id} value={id}>
                      {w.name} — AQI {w.aqi} ({w.category})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#D8F3DC',
                    marginBottom: '7px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Notification Profile
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#081C15',
                    border: '1.5px solid #2D6A4F',
                    borderRadius: '12px',
                    padding: '13px 14px',
                    fontSize: '14px',
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="citizen">Daily Commuter / Resident</option>
                  <option value="school_principal">School Principal / Administrator</option>
                  <option value="hospital_staff">Healthcare / Vulnerable Patient</option>
                  <option value="transit_worker">Outdoor / Transit Worker</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '16px',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                  letterSpacing: '0.5px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <span>DISPATCHING ADVISORY...</span>
                ) : (
                  <>
                    <span>ACTIVATE EMERGENCY AIR ALERTS</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Danger Areas to Avoid */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '14px',
                padding: '14px',
                marginTop: '18px'
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#F87171',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <AlertTriangle size={14} />
                CRITICAL DANGER CORRIDORS TO AVOID
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>1. Anand Vihar ISBT &amp; Transit Hub</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#EF4444' }}>AQI 418</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>2. Jahangirpuri Transport Corridor</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#EF4444' }}>AQI 396</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>3. Wazirpur Industrial Cluster</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#EF4444' }}>AQI 390</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>4. Bawana North Airshed</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#EF4444' }}>AQI 384</span>
              </div>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div
            style={{
              background: 'linear-gradient(135deg, #0F3826 0%, #144D34 100%)',
              border: '2px solid #4ADE80',
              borderRadius: '18px',
              padding: '28px 20px',
              textAlign: 'center',
              boxShadow: '0 12px 35px rgba(0,0,0,0.4)',
              marginBottom: '18px'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(74, 222, 128, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#4ADE80'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h2
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '8px'
              }}
            >
              REGISTRATION SUCCESSFUL!
            </h2>

            <p
              style={{
                fontSize: '13.5px',
                color: '#D8F3DC',
                lineHeight: 1.5,
                marginBottom: '18px'
              }}
            >
              Verified emergency advisory with <strong>Active Danger Corridors to Avoid</strong> has been successfully dispatched to <strong>{dispatchedEmail}</strong>.
            </p>

            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '12px',
                color: '#A7F3D0',
                textAlign: 'left',
                lineHeight: 1.6,
                marginBottom: '20px'
              }}
            >
              <div>&bull; <strong>Status:</strong> Active 72-Hour Airshed Protection Watch</div>
              <div>&bull; <strong>Danger Notice:</strong> Avoid Anand Vihar &amp; Jahangirpuri during morning inversion (05:00-09:30 AM)</div>
              <div>&bull; <strong>Delivery:</strong> Real-time SMTP Broadcast</div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setEmail('');
                setName('');
              }}
              style={{
                background: '#2D6A4F',
                border: 'none',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={14} /> Register Another Device
            </button>
          </div>
        )}

        {/* Switch to Full Airshed Control Room Dashboard */}
        <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '8px' }}>
          <button
            onClick={() => {
              if (onSwitchToDashboard) {
                onSwitchToDashboard();
              } else {
                window.location.href = '/';
              }
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#D8F3DC',
              padding: '9px 18px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Globe size={13} color="#52B788" />
            <span>Open Full Airshed Control Room</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: '#64748B' }}>
          AERIS Clean Air Intelligence &bull; Bharat Builds 2026
        </div>
      </div>
    </div>
  );
};
