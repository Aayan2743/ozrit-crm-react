// import { createContext, useState } from "react";

// export const BioContext =createContext();

// export const BioProvider=({children })=>{

  
    
//   const [accessToken, setAccessTokenState] = useState(localStorage.getItem("access_token"));
//   const [isLogin, setIsLogin] = useState(!!localStorage.getItem("access_token"));

//   const setAccessToken = (token) => {
//     setAccessTokenState(token);
//     setIsLogin(true);
//     localStorage.setItem("access_token", token);
//     localStorage.setItem("user_details", token);
//   };



//   const logout = () => {
//     setAccessTokenState(null);
//     setIsLogin(false);
//     localStorage.removeItem("access_token");
//   };


//     return <BioContext.Provider value={{  accessToken, setAccessToken,logout ,setIsLogin, isLogin}}>
//                 {children }
//     </BioContext.Provider>


// }



import { createContext, useState } from "react";

export const BioContext = createContext();

export const BioProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(localStorage.getItem("access_token"));
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("access_token"));

  // Initialize from localStorage or null
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user_details");
    return stored ? JSON.parse(stored) : null;
  });

  const setAccessToken = (token) => {
    setAccessTokenState(token);
    setIsLogin(true);
    localStorage.setItem("access_token", token);
  };

  // Set user and also save to localStorage
  const setUserDetails = (userData) => {
    setUser(userData);
    localStorage.setItem("user_details", JSON.stringify(userData));
  };

  const logout = () => {
    setAccessTokenState(null);
    setIsLogin(false);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_details");
  };

  return (
    <BioContext.Provider value={{ accessToken, setAccessToken, user, setUserDetails, logout, setIsLogin, isLogin }}>
      {children}
    </BioContext.Provider>
  );
};
