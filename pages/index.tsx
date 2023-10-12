import type { NextPage } from 'next';
import React, { useEffect } from 'react';
import Wallet from '../components/Wallet';
import { useListen } from '../hooks/listen';
import { useMetamask } from '../hooks/metamask';

const Home: NextPage = () => {
  const { dispatch } = useMetamask();
  const listen = useListen();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isEthereumProviderInjected = typeof window.ethereum !== 'undefined';
      const isMetamaskInstalled = isEthereumProviderInjected && Boolean(window.ethereum.isMetaMask);
      
      const localState = window.localStorage.getItem('metamaskState');
      if (localState) {
        listen();
      }

      const { wallet, balance } = localState
        ? JSON.parse(localState)
        : { wallet: null, balance: null };

      dispatch({ type: 'pageLoaded', isMetamaskInstalled, wallet, balance });
    }
  }, []);

  return (
    <div>
      <Wallet />
    </div>
  );
};

export default Home;
