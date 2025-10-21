import { createContext, useState } from "react";

// Create the context with a default value
export const AppState = createContext({
  user: "",
  setUser: () => {}, // default noop function
});

// Provider component
const DataContext = ({ children }) => {
  const [user, setUser] = useState(""); // manage user state

  return (
    <AppState.Provider value={{ user, setUser }}>{children}</AppState.Provider>
  );
};

export default DataContext;
