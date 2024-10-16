import React, { ReactNode, useReducer, useContext, useMemo, Dispatch } from "react";
import PropTypes from "prop-types";

// Define the types for the state and action
interface State {
  openSidenav: boolean;
  sidenavColor: string;
  sidenavType: string;
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
}

interface Action {
  type: string;
  value: any;
}

// Create the context
export const MaterialTailwind = React.createContext<[State, Dispatch<Action>] | null>(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

// Define the reducer function
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN_SIDENAV":
      return { ...state, openSidenav: action.value };
    case "SIDENAV_TYPE":
      return { ...state, sidenavType: action.value };
    case "SIDENAV_COLOR":
      return { ...state, sidenavColor: action.value };
    case "TRANSPARENT_NAVBAR":
      return { ...state, transparentNavbar: action.value };
    case "FIXED_NAVBAR":
      return { ...state, fixedNavbar: action.value };
    case "OPEN_CONFIGURATOR":
      return { ...state, openConfigurator: action.value };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Define the provider component
interface ProviderProps {
  children: ReactNode;
}

export function MaterialTailwindControllerProvider({ children }: ProviderProps): JSX.Element {
  const initialState: State = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  
  // Explicitly type the value variable as a tuple
  const value: [State, Dispatch<Action>] = useMemo(() => [controller, dispatch], [controller]);

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

// Custom hook to use the MaterialTailwind context
export function useMaterialTailwindController() {
  const context = useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

// Display name for the provider component
MaterialTailwindControllerProvider.displayName = "MaterialTailwindControllerProvider";

MaterialTailwindControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Action creators
export const setOpenSidenav = (dispatch: Dispatch<Action>, value: boolean) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch: Dispatch<Action>, value: string) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch: Dispatch<Action>, value: string) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (dispatch: Dispatch<Action>, value: boolean) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch: Dispatch<Action>, value: boolean) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch: Dispatch<Action>, value: boolean) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
