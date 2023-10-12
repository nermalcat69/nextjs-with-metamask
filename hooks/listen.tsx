import { useMetamask } from './metamask';

// Define a custom hook for listening to Metamask account changes
export const useListen = () => {
  const { dispatch } = useMetamask();

  // Define the account change listener
  const listenToAccountChanges = () => {
    window.ethereum.on('accountsChanged', async (newAccounts: string[]) => {
      if (newAccounts.length > 0) {
        const newBalance = await window.ethereum!.request({
          method: 'eth_getBalance',
          params: [newAccounts[0], 'latest'],
        });

        dispatch({
          type: 'connect',
          wallet: newAccounts[0],
          balance: newBalance,
        });
      } else {
        dispatch({ type: 'disconnect' });
      }
    });
  };

  return listenToAccountChanges;
};
