import React from 'react';
import { Activity, Wind, Thermometer, Layers, AlertCircle } from 'lucide-react';
import { CurrentState } from '../../types';

interface CurrentStateTilesProps {
  state: CurrentState | null;
}

export const CurrentStateTiles: React.FC<CurrentStateTilesProps> = ({ state }) => {
  const aqi = state?.aqi ?? 165;
  const pm25 = state?.pm25 ?? 85.0;
  const pm10 = state?.pm10 ?? 180.0;
  const pblh = state?.boundary_layer_height ?? 845.0;
  const wind = state?.wind_speed_10m ?? 2.5;
  const inv = state?.inversion_strength ?? 1.2;
  const no2 = state?.no2 ?? 35.0;

  const isObserved = state?.provenance === 'OBSERVED';
  const tagLabel = isObserved ? 'OBSERVED LIVE' : 'MODELLED';

  const getAQIColor = (val: number): string => {
    if (val <= 50) return '#16A34A';
    if (val <= 100) return '#65A30D';
    if (val <= 200) return '#EAB308';
    if (val <= 300) return '#EA580C';
    if (val <= 400) return '#DC2626';
    return '#991B1B';
  };

  const aqiColor = getAQIColor(aqi);

  // Normalized visual percentage helpers
  const pm25Pct = Math.min(100, Math.round((pm25 / 300) * 100));
  const pm10Pct = Math.min(100, Math.round((pm10 / 500) * 100));
  const pblhPct = Math.min(100, Math.round((pblh / 2000) * 100));
  const invPct = Math.min(100, Math.round((inv / 4.0) * 100));

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '12px 18px',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        fontFamily: 'var(--font-main)'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          alignItems: 'center'
        }}
      >
        {/* 1. Primary AQI Metric */}
        <div
          style={{
            borderRight: '1px solid #E2E8F0',
            paddingRight: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '8px',
              background: `${aqiColor}15`,
              border: `2px solid ${aqiColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Activity size={26} color={aqiColor} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px' }}>
                CPCB NAQI
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  background: isObserved ? '#DCFCE7' : '#E0F2FE',
                  color: isObserved ? '#15803D' : '#0369A1',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
              >
                {tagLabel}
              </span>
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: aqiColor,
                lineHeight: 1.1,
                fontFamily: 'var(--font-mono)'
              }}
            >
              {Math.round(aqi)}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: aqiColor }}>
              {state?.category?.toUpperCase() || 'MODERATE'}
            </div>
          </div>
        </div>

        {/* 2. PM2.5 Fine Particulate */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '13.5px', marginBottom: '4px' }}>
            <span style={{ color: '#475569', fontWeight: 700 }}>PM2.5 Aerosol</span>
            <span style={{ fontWeight: 800, color: '#DC2626', fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
              {pm25} µg/m³
            </span>
          </div>
          <div className="mini-meter-track">
            <div
              className="mini-meter-fill"
              style={{
                width: `${pm25Pct}%`,
                background: pm25 > 120 ? '#DC2626' : pm25 > 60 ? '#EA580C' : '#16A34A'
              }}
            />
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px' }}>
            National Standard: 60 µg/m³
          </div>
        </div>

        {/* 3. PM10 Coarse Particulate */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '13.5px', marginBottom: '4px' }}>
            <span style={{ color: '#475569', fontWeight: 700 }}>PM10 Respirable</span>
            <span style={{ fontWeight: 800, color: '#EA580C', fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
              {pm10} µg/m³
            </span>
          </div>
          <div className="mini-meter-track">
            <div
              className="mini-meter-fill"
              style={{
                width: `${pm10Pct}%`,
                background: pm10 > 250 ? '#DC2626' : pm10 > 100 ? '#EA580C' : '#16A34A'
              }}
            />
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px' }}>
            National Standard: 100 µg/m³
          </div>
        </div>

        {/* 4. Planetary Boundary Layer Height */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '13.5px', marginBottom: '4px' }}>
            <span style={{ color: '#475569', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Layers size={14} /> PBL Height
            </span>
            <span style={{ fontWeight: 800, color: '#7C3AED', fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
              {Math.round(pblh)} m
            </span>
          </div>
          <div className="mini-meter-track">
            <div
              className="mini-meter-fill"
              style={{
                width: `${pblhPct}%`,
                background: '#7C3AED'
              }}
            />
          </div>
          <div style={{ fontSize: '11.5px', color: pblh < 500 ? '#DC2626' : '#16A34A', marginTop: '3px', fontWeight: 700 }}>
            {pblh < 500 ? 'Severe Compression' : 'Adequate Ventilation'}
          </div>
        </div>

        {/* 5. Inversion Lid & Surface Wind */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '13.5px', marginBottom: '4px' }}>
            <span style={{ color: '#475569', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Thermometer size={14} /> Thermal Lid
            </span>
            <span style={{ fontWeight: 800, color: '#D97706', fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
              +{inv} K
            </span>
          </div>
          <div className="mini-meter-track">
            <div
              className="mini-meter-fill"
              style={{
                width: `${invPct}%`,
                background: inv > 1.0 ? '#DC2626' : '#F59E0B'
              }}
            />
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Wind size={13} color="#0284C7" />
            <span>Wind: <strong>{wind} m/s WNW</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
