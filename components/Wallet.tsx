import Link from "next/link";
import { useListen } from "../hooks/listen";
import { useMetamask } from "../hooks/metamask";
import { Loading } from "./Loading";



// Notification component
const Notification: React.FC = () => {
  return (
    <div className="notification bg-truffle ">
      <div className=" text-lg relative px-4 p-2 text-gray-100 ">
      😟 Metamask Not Found! Please{' '}
      <a href="https://metamask.io/download/" className="pointer underline hover:text-gray-300" target="_blank" rel="noopener noreferrer">
        Install MetaMask
      </a>
        </div>
    </div>
  );
};


// Wallet component
export default function Wallet() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();

  const showInstallMetamask =
    status !== "pageNotLoaded" && !isMetamaskInstalled;
  const showConnectButton =
    status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      dispatch({ type: "connect", wallet: accounts[0], balance });

      listen();
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  const handleAddUsdc = async () => {
    dispatch({ type: "loading" });

    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          symbol: "USDT",
          decimals: 18,
          image: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=026",
        },
      },
    });
    dispatch({ type: "idle" });
  };

  return (
    <div className="grid justify-center place-items-center h-screen m-8 sm:m-0">
      <div className="mx-auto max-w-2xl py-16 px-4 place-self-center text-center bg-neutral-50  duration-200 sm:py-20 sm:px-6 lg:px-8 rounded-xl">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
          <span className="block">NextJs + Metamask</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-gray-600">
          checkout the{" "}
          <Link
            href="https://github.com/nermalcat69/nextjs-with-metamask"
            rel= "noopener"
            target="_blank"
          >
            <span className="cursor-pointer text-gray-800 font-bold">repository</span>
          </Link>{" "}
          to implement metamask api and setup metamask with nextjs.
        </p>

        {wallet && balance && (
          <div className="mt-5 p-3">
            <div className="block">
            <span className=" text-gray-800 p-1.5 rounded-md mr-1 font-medium">Your Address:</span>
              <span>
                {wallet}
              </span>
            </div>
          <div className="block mt-4">
            <span className=" text-gray-800 p-1.5 rounded-md mr-1 font-medium">Balance:{" "}</span>
              <span>
                {(parseInt(balance) / 1000000000000000000).toFixed(2)}{" "} ETH
              </span>
          </div>
          </div>
        )}


        {showConnectButton && (
          <button
            onClick={handleConnect}
            className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-truffle hover:bg-red-400 text-white px-5 py-3 text-base font-medium  sm:w-auto"
          >
            {status === "loading" ? <Loading /> : "Connect Wallet"}
          </button>
        )}

      
        {showInstallMetamask && (
          <span
            className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gray-200 text-gray-500 px-6 py-3 text-base font-medium cursor-not-allowed sm:w-auto"
          >
                                <span className="block animate-ping mr-4 h-2 w-2 rounded-full opacity-90 bg-gray-600 "></span>

            🚫 Metamask Not Found!
          </span>
        )}


        {isConnected && (
          <div className="flex  w-full justify-center space-x-2">
            <button
              onClick={handleAddUsdc}
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-truffle hover:bg-orange-600 text-white px-5 py-3 text-base font-medium  sm:w-auto"
            >
              {status === "loading" ? <Loading /> : "Add Token"}
            </button>
            <button
              onClick={handleDisconnect}
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-truffle hover:bg-orange-600 duration-75	 text-white px-5 py-3 text-base font-medium  sm:w-auto"
            >
              Disconnect
            </button>
            <button className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-truffle hover:bg-orange-600 duration-75	 text-white px-5 py-3 text-base font-medium  sm:w-auto"
              >
             <a href={`https://etherscan.io/address/${wallet}`} className="" target="_blank" rel="noopener noreferrer">Check on Etherscan</a> 
            </button>
          </div>

          
        )}
      </div>

              {showInstallMetamask && Notification (
          <Link
            href="https://metamask.io/download/"
            target="_blank"
            className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-truffle text-white px-5 py-3 text-base font-medium  sm:w-auto"
          >
            😟 Metamask Not Found!
          </Link>
      )}
      
    </div>

  );
}


// Nermalcat69
