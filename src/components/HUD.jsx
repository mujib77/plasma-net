export default function HUD({ issData }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 10,
      fontFamily: 'Courier New, monospace',
    }}>
  
      <div style={{ position: 'absolute', top: 24, left: 24, color: '#00d4ff' }}>
        <div style={{ fontSize: 11, opacity: 0.6 }}>PLASMA-NET</div>
        <div style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: 4 }}>SOLAR MONITOR</div>
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4 }}>NOAA SATELLITE FEED — LIVE</div>
      </div>

      <div style={{
        position: 'absolute', bottom: 24, left: 24,
        color: '#00d4ff',
      }}>
        <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 6, letterSpacing: 2 }}>
          ● ISS TRACKING — LIVE
        </div>
        <div style={{ fontSize: 11, opacity: 0.6 }}>ALTITUDE</div>
        <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 2 }}>
          {issData ? `${Math.round(issData.altitude)} km` : '— km'}
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>VELOCITY</div>
        <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 2 }}>
          {issData ? `${Math.round(issData.velocity).toLocaleString()} km/h` : '— km/h'}
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>POSITION</div>
        <div style={{ fontSize: 13, letterSpacing: 1 }}>
          {issData
            ? `${issData.latitude.toFixed(2)}° ${issData.latitude >= 0 ? 'N' : 'S'}  ${issData.longitude.toFixed(2)}° ${issData.longitude >= 0 ? 'E' : 'W'}`
            : '— ° —°'}
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 24, right: 24,
        color: '#00d4ff', textAlign: 'right',
      }}>
        <div style={{ fontSize: 10, opacity: 0.5 }}>SOLAR WIND</div>
        <div style={{ fontSize: 24, fontWeight: 'bold' }}>— km/s</div>
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 8 }}>PLASMA DENSITY</div>
        <div style={{ fontSize: 24, fontWeight: 'bold' }}>— p/cm³</div>
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 8 }}>IMF Bz</div>
        <div style={{ fontSize: 24, fontWeight: 'bold' }}>— nT</div>
      </div>
    </div>
  )
}