export default function HUD({ issData, solarWind }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 10,
      fontFamily: "'Space Mono', monospace",
    }}>

      <div style={{ position: 'absolute', top: 28, left: 28 }}>
        <div style={{
          fontSize: 9, letterSpacing: 4,
          color: 'rgba(255,255,255,0.3)',
          marginBottom: 6
        }}>
          PLASMA-NET / SOLAR MONITOR
        </div>
        <div style={{
          fontSize: 22, fontWeight: 700,
          letterSpacing: 6, color: '#ffffff',
          lineHeight: 1
        }}>
          PLASMA<span style={{ color: '#ff4444' }}>·</span>NET
        </div>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 6, marginTop: 8
        }}>
          <span className="live-dot" style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#ff4444', display: 'inline-block'
          }} />
          <span style={{
            fontSize: 9, letterSpacing: 3,
            color: 'rgba(255,255,255,0.35)'
          }}>
            LIVE FEED
          </span>
        </div>
      </div>

<div className="panel" style={{
  position: 'absolute', top: 28, right: 28,
  minWidth: 180, textAlign: 'right'
}}>
  <div className="label">SOLAR WIND</div>
  <div className="value">
    {solarWind ? solarWind.speed : '—'}
    <span style={{ fontSize: 12, opacity: 0.5 }}> km/s</span>
  </div>
  <div className="divider" />
  <div className="label">PLASMA DENSITY</div>
  <div className="value">
    {solarWind ? solarWind.density : '—'}
    <span style={{ fontSize: 12, opacity: 0.5 }}> p/cm³</span>
  </div>
  <div className="divider" />
  <div className="label">IMF Bz</div>
  <div className="value" style={{
    color: solarWind?.storm ? '#ff4444' : '#ffffff'
  }}>
    {solarWind ? solarWind.bz : '—'}
    <span style={{ fontSize: 12, opacity: 0.5 }}> nT</span>
  </div>
  {solarWind?.storm && (
    <div style={{
      marginTop: 10, fontSize: 9,
      letterSpacing: 3, color: '#ff4444'
    }}
      className="live-dot"
    >
      ⚠ GEOMAGNETIC STORM
    </div>
  )}
</div>

      <div className="panel" style={{
        position: 'absolute', bottom: 28, left: 28,
        minWidth: 220
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span className="live-dot" style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#ff4444', display: 'inline-block'
          }} />
          <span style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.35)' }}>
            ISS / ZARYA
          </span>
        </div>

        <div className="label">ALTITUDE</div>
        <div className="value">
          {issData ? Math.round(issData.altitude) : '—'}
          <span style={{ fontSize: 12, opacity: 0.5 }}> km</span>
        </div>

        <div className="divider" />

        <div className="label">VELOCITY</div>
        <div className="value">
          {issData ? Math.round(issData.velocity).toLocaleString() : '—'}
          <span style={{ fontSize: 12, opacity: 0.5 }}> km/h</span>
        </div>

        <div className="divider" />

        <div className="label">COORDINATES</div>
        <div className="value-sm">
          {issData
            ? `${Math.abs(issData.latitude).toFixed(2)}° ${issData.latitude >= 0 ? 'N' : 'S'}   ${Math.abs(issData.longitude).toFixed(2)}° ${issData.longitude >= 0 ? 'E' : 'W'}`
            : '— ° —°'
          }
        </div>

        <div style={{ marginTop: 10 }}>
          <div className="label">STATUS</div>
          <div style={{ fontSize: 9, letterSpacing: 2, color: issData?.visibility === 'eclipsed' ? 'rgba(255,255,255,0.3)' : '#ff4444' }}>
            {issData ? issData.visibility?.toUpperCase() : '—'}
          </div>
        </div>
      </div>

<div style={{
  position: 'absolute', bottom: 28, right: 28,
  textAlign: 'right',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  alignItems: 'flex-end'
}}>
  <a
    href="https://github.com/mujib77/plasma-net"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      pointerEvents: 'all',
      color: 'rgba(255,255,255,0.25)',
      fontSize: 9,
      letterSpacing: 3,
      textDecoration: 'none',
      border: '1px solid rgba(255,255,255,0.08)',
      padding: '4px 10px',
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => {
      e.target.style.color = 'rgba(255,255,255,0.7)'
      e.target.style.borderColor = 'rgba(255,255,255,0.3)'
    }}
    onMouseLeave={e => {
      e.target.style.color = 'rgba(255,255,255,0.25)'
      e.target.style.borderColor = 'rgba(255,255,255,0.08)'
    }}
  >
    ★ GITHUB
  </a>
  <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.12)' }}>
  DRAG TO ROTATE · SCROLL TO ZOOM
  </div>
</div>
    </div>
  )
}