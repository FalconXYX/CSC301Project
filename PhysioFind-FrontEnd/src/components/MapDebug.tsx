import { Map } from '@vis.gl/react-google-maps';

const TORONTO = { lat: 43.6532, lng: -79.3832 };

export default function MapDebug() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <Map defaultCenter={TORONTO} defaultZoom={12} />
    </div>
  );
}
