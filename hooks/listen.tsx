import { useMetamask } from "./metamask";

export const useListen = () => {
  const { dispatch } = useMetamask();

  return () => {
    window.ethereum.on("accountsChanged", async (newAccounts: string[]) => {
      if (newAccounts.length > 0) {

        const newBalance = await window.ethereum!.request({
          method: "eth_getBalance",
          params: [newAccounts[0], "latest"],
        });

        dispatch({
          type: "connect",
          wallet: newAccounts[0],
          balance: newBalance,
        });
      } else {

        dispatch({ type: "disconnect" });
      }
    });
  };
};
