import React from 'react';
import {
  MapPin,
  TrendingUp,
  Activity,
  Compass,
  Sliders,
  Table,
  ShieldCheck,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { NavigationPage } from '../../types';

interface GovernmentHeaderProps {
  currentPage: NavigationPage;
  onPageChange: (page: NavigationPage) => void;
  operatingMode?: string;
  lastUpdated?: string;
  modelStatus?: string;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({
  currentPage,
  onPageChange,
  operatingMode = 'LIVE REAL-TIME TELEMETRY (OpenAQ v3 + NASA FIRMS VIIRS)',
  lastUpdated = 'Live Synchronized',
  modelStatus = 'OPERATIONAL (RANK 12)'
}) => {
  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Delhi Map & Heatmap', icon: <MapPin size={15} /> },
    { id: 'forecast', label: '72h Forecast', icon: <TrendingUp size={15} /> },
    { id: 'atmosphere', label: 'Coupled Feedback & Inversion', icon: <Activity size={15} /> },
    { id: 'sources', label: 'Sources & Plumes', icon: <Compass size={15} /> },
    { id: 'intervention', label: 'Intervention & MPC', icon: <Sliders size={15} /> },
    { id: 'monitoring', label: 'Stations & Live Telemetry', icon: <Table size={15} /> },
    { id: 'model', label: 'Model Verification', icon: <ShieldCheck size={15} /> }
  ];

  return (
    <header className="portal-header" style={{ fontFamily: 'var(--font-main)' }}>
      <div className="portal-header-top">
        {/* Left: Institutional Title */}
        <div className="portal-title-block">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontFamily: "var(--font-main)", letterSpacing: '-0.5px' }}>
              AERIS
            </h1>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                background: '#E0F2FE',
                color: '#0369A1',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #BAE6FD'
              }}
            >
              v5.0 LIVE
            </span>
          </div>
          <div className="full-name" style={{ color: '#334155' }}>
            Atmospheric Emission-Response Intelligence System
          </div>
          <div className="subtitle" style={{ color: '#64748B' }}>
            National Clean Air Mission • Central Pollution Control Board • Coupled Atmospheric Inversion Physics
          </div>
        </div>

        {/* Center: Geographical & Spatial Domain */}
        <div className="portal-meta-center">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 800,
              color: '#003366',
              fontSize: '15px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <MapPin size={14} color="#003366" />
            DELHI NCR AIRSHED
          </div>
          <div style={{ color: '#475569', fontSize: '13px', marginTop: '3px' }}>
            Grid: <strong>3 km (WRF-Chem D03)</strong> · Horizon: <strong>72 Hours</strong>
          </div>
        </div>

        {/* Right: Operational & Data Telemetry Status */}
        <div className="portal-meta-right">
          <div className="status-row">
            <span style={{ color: '#64748B', fontSize: '13px' }}>Telemetry:</span>
            <span
              className="status-pill"
              style={{
                background: '#F0FDF4',
                color: '#15803D',
                border: '1px solid #BBF7D0'
              }}
            >
              <span className="status-dot-pulse" />
              <span>LIVE TELEMETRY (OpenAQ + NASA FIRMS)</span>
            </span>
          </div>
          <div className="status-row" style={{ marginTop: '4px' }}>
            <span style={{ color: '#64748B', fontSize: '13px' }}>Status:</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#0F172A'
              }}
            >
              <CheckCircle2 size={13} color="#16A34A" />
              {modelStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar with Clean SVG Icons */}
      <nav className="portal-nav" aria-label="Portal Sections">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`portal-nav-item ${currentPage === item.id ? 'active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};
