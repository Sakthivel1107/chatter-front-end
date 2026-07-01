import React, { useContext } from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import {Navigate, Route, Routes} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import Home from './pages/Home/Home';
import { StoreContext } from './context/StoreContext';
import {jwtDecode} from 'jwt-decode';
import LandingPage from './pages/LandingPage/LandingPage';

const App = () => {
  const {token,setToken} = useContext(StoreContext);
  const isAuthenticated = token || localStorage.getItem("token") || sessionStorage.getItem("token");
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route element={<LandingPage />} path='/'></Route>
        <Route element={<Login />} path='/login'></Route>
        <Route element={<Register />} path='/register'></Route>
        <Route element={isAuthenticated ? <Home />: <Navigate to='/login'/>} path='/home'></Route>
      </Routes>
      
    </div>
  );
};

export default App;
