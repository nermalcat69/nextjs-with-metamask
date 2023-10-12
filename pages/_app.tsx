// Import global styles
import '../src/styles/globals.css';

import type { AppProps } from 'next/app';
import { MetamaskProvider } from '../hooks/metamask';

// Define the main application component
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <Component {...pageProps} />
    </MetamaskProvider>
  );
}

// Export the main application component
export default MyApp;
