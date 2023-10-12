import React, { createContext, useContext, useReducer, PropsWithChildren } from "react";

// Define action types
type ConnectAction = { type: "connect"; wallet: string; balance: string };
type DisconnectAction = { type: "disconnect" };
type PageLoadedAction = {
  type: "pageLoaded";
  isMetamaskInstalled: boolean;
  wallet: string | null;
  balance: string | null;
};
type LoadingAction = { type: "loading" };
type IdleAction = { type: "idle" };

// Create a union type for all actions
type Action =
  | ConnectAction
  | DisconnectAction
  | PageLoadedAction
  | LoadingAction
  | IdleAction;

// Define the Dispatch type
type Dispatch = (action: Action) => void;

// Define the Status type
type Status = "loading" | "idle" | "pageNotLoaded";

// Define the initial state
type State = {
  wallet: string | null;
  isMetamaskInstalled: boolean;
  status: Status;
  balance: string | null;
};

const initialState: State = {
  wallet: null,
  isMetamaskInstalled: false,
  status: "loading",
  balance: null,
};

// Reducer function
function metamaskReducer(state: State, action: Action): State {
  switch (action.type) {
    case "connect": {
      const { wallet, balance } = action;
      const newState: State = { ...state, wallet, balance, status: "idle" };
      const info = JSON.stringify(newState);
      window.localStorage.setItem("metamaskState", info);
      return newState;
    }
    case "disconnect": {
      window.localStorage.removeItem("metamaskState");
      if (typeof window.ethereum !== undefined) {
        window.ethereum.removeAllListeners(["accountsChanged"]);
      }
      return { ...state, wallet: null, balance: null };
    }
    case "pageLoaded": {
      const { isMetamaskInstalled, balance, wallet } = action;
      return { ...state, isMetamaskInstalled, status: "idle", wallet, balance };
    }
    case "loading": {
      return { ...state, status: "loading" };
    }
    case "idle": {
      return { ...state, status: "idle" };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

// Create a context for Metamask
const MetamaskContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(
  undefined
);

// MetamaskProvider component
function MetamaskProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(metamaskReducer, initialState);
  const value = { state, dispatch };

  return (
    <MetamaskContext.Provider value={value}>
      {children}
    </MetamaskContext.Provider>
  );
}

// Custom hook for using Metamask context
function useMetamask() {
  const context = useContext(MetamaskContext);
  if (context === undefined) {
    throw new Error("useMetamask must be used within a MetamaskProvider");
  }
  return context;
}

export { MetamaskProvider, useMetamask };