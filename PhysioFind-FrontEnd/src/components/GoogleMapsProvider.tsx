import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

/**
 * GoogleMapsProvider wraps its children in an APIProvider to load the
 * Google Maps JavaScript API.  It reads the API key from the
 * `VITE_GOOGLE_MAPS_API_KEY` environment variable.  The provider must
 * surround any components that rely on Google Maps (for example, map
 * components, markers or Places autocomplete inputs).
 */
export const GoogleMapsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Read the API key from the environment.  Vite exposes variables
  // prefixed with VITE_ on `import.meta.env`.  If the key is undefined,
  // throw an error to alert the developer during development.
  const apiKey: string | undefined = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GoogleMapsProvider: missing VITE_GOOGLE_MAPS_API_KEY.\n' +
        'Add the API key to your .env file as VITE_GOOGLE_MAPS_API_KEY before using Google Maps.',
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={['places']}
      region="CA"
      onLoad={() => console.info('Google Maps API loaded')}
      onError={(e) => console.error('Google Maps API load error', e)}
    >
      {children}
    </APIProvider>
  );
};

export default GoogleMapsProvider;