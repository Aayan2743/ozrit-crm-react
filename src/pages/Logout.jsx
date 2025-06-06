// Logout.jsx
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { BioContext } from '../context/authContext'

const Logout = () => {
  const { logout } = useContext(BioContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();            // clear access token, login flag
    navigate("/");  // redirect to login
  }, []);

  return null; // or a loader/spinner if you want
};

export default Logout;
