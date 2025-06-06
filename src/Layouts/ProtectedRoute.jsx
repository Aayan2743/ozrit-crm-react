import React, { useContext } from 'react'
import { Navigate ,Outlet } from 'react-router-dom'
import { BioContext } from '../context/authContext'


export const ProtectedRoute = () => {

  const {isLogin} =useContext(BioContext);
  return isLogin ?  <Outlet /> : <Navigate to="/" />
}



// exsport default ProtectedRoute
