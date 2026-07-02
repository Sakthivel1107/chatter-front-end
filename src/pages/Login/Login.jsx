import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import {FcGoogle} from 'react-icons/fc';
import loginImg from '../../assets/login.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { loginFunction } from '../../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const {token,setToken,tokenRef} = useContext(StoreContext);
    const [loading,setLoading] = useState(false);
    const [data,setData] = useState({
        email:'',
        password:'',
    });
    const [remember,setRemember] = useState(false);
    const onSubmitHandler = (event) => {
        event.preventDefault();
    };
    const onSignInHandler = async()=>{
        try {
            setLoading(true);
            const response = await loginFunction(data);
            if(response.status===200){
                const jwt = response.data.token;
                setToken(jwt);
                if(remember){
                    localStorage.setItem("token",jwt);
                    sessionStorage.removeItem("token");
                }
                else{
                    localStorage.removeItem("token");
                    sessionStorage.setItem("token",jwt);
                }
                setLoading(false);
                navigate('/home');
            }

        } catch (error) {
            setLoading(false);
            toast.error("Please try again credentials are not valid");
            console.error(error);
        }
    }
    const resetHandler = ()=>{
        setData({
            email:'',
            password:'',
        });
    }
    // const onGoogleSubmit = () => {
    //     if (!window.google) {
    //         console.log(window.google);
    //         return;
    //     }
    //     window.google.accounts.id.prompt();
    // };
    // useEffect(
    // ()=>{
    //     if (!window.google?.accounts?.id) {
    //         console.log("Google SDK not loaded yet");
    //         return;
    //     }
    //     window.google.accounts.id.initialize({
    //         client_id:"743430335446-fget5kgi9kpki20e3d7a8f62h339s8m3.apps.googleusercontent.com",
    //         callback: async(response) =>{
    //             const result = await axios.post("http://localhost:8080/api/google-login",{
    //                 idToken: response.credential
    //             });
    //             console.log(result.data.token);
    //         }
    //     });
    // },[]
    // );
    const onRememberHandler = (event) => {
        setRemember(event.target.checked);
    }
    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({...prev,[name]:value}));
    };
  return (
    <div className='mainl-container d-flex justify-content-center'>
        
            <div className='forml-container d-flex flex-column gap-3'>
                <div className='d-flex flex-column align-items-center'>
                    <div className='d-flex gap-1 align-items-center'>
                        <i className='bi bi-chat chat-icon'></i>
                        <h2 className='fh2 pt-1'>Chatter</h2>
                    </div>
                    <h3 className='fh3'>Welcome Back</h3>
                    <small className='text-secondary'>Login to continue to your account</small>
                </div>
                <form onSubmit={onSubmitHandler} className='d-flex gap-3 align-items-start justify-content-center flex-column forml-div'>
                    <div className='flex-start'>
                        <label htmlFor="email" className='fw-bold'><small>Email</small></label>
                        <div htmlFor="email" className='inputl-div'>
                            <i className='bi bi-envelope ficon fs-5 text-secondary'></i>
                            <input placeholder='example@email.com' onChange={onChangeHandler} value={data.email} type="email" id='email' name='email' className='flinput'/>
                        </div>
                    </div>
                    <div className='flex-start'>
                        <label htmlFor="password" className='fw-bold'><small>Password</small></label>
                        <div htmlFor="password" className='inputl-div'>
                            <i className='bi bi-lock ficon fs-5 text-secondary'></i>
                            <input type="password" onChange={onChangeHandler} value={data.password} placeholder='Enter your password' id='password' name='password' className='flinput'/>
                        </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-between fp'>
                        <div className='d-flex align-items-center pe-2'>
                            <input type="checkbox" onChange={onRememberHandler} checked={remember}  className='me-1'/> <small className='ftl'>Remember me?</small>
                        </div>
                        <small style={{color:'rgb(2, 189, 189)'}} className='ftl' onClick={resetHandler}>Reset?</small>
                    </div>
                    <button className='submit' onClick={onSignInHandler}>
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                ></span>
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                    <div className='d-flex align-items-center' style={{width:'100%'}}>
                        <div className='fline'></div>
                        <small className='ftl px-1 text-secondary'>or continue with</small>
                        <div className='fline'></div>
                    </div>
                    <button type='button' className='gsubmit d-flex align-items-center justify-content-center gap-1'>
                        <FcGoogle className='fs-4'/> <span>Google</span>
                    </button>
                    <div style={{width:'100%'}} className='d-flex justify-content-center'>
                        <small className='ftl me-1'>Don't have an account?</small> <small className='ftl hov' style={{color:'rgb(2, 189, 189)'}} onClick={()=>navigate('/register')}><u>Sign up</u></small>
                    </div>
                </form>
            </div>
            <div className='designl-container pt-4 d-none d-lg-flex flex-column align-items-center'>
                <h3 className='heading'>Stay Connected,</h3>
                <h3 className='heading'>Share moments.</h3>
                <div className='hline rounded-pill'></div>
                <img src={loginImg} alt="desgin" className='d-img'/>
                <div>
                    <div className='d-flex gap-2 ps-1'>
                        <div className='dl-div d-flex align-items-start gap-2 py-2 px-1'>
                            <i className='bi bi-shield dicon fs-5 rounded-circle'></i>
                            <div className='d-flex flex-column gap-2'>
                                <h6 className='fh6' style={{margin:'0px',fontWeight:'bold'}}>Secure</h6>
                                <p className='text-secondary' style={{fontSize:'11px',margin:'0px'}}>Your data is safe and protected.</p>
                            </div>
                        </div>
                        <div className='dl-div d-flex align-items-start gap-2 p-2'>
                            <i className='bi bi-lightning dicon fs-5 rounded-circle px-2'></i>
                            <div className='d-flex flex-column gap-2'>
                                <h6 className='fh6' style={{margin:'0px',fontWeight:'bold'}}>Fast</h6>
                                <p className='text-secondary' style={{fontSize:'11px',margin:'0px'}}>Quick access and smooth experience.</p>
                            </div>
                        </div>
                        <div className='dl-div d-flex align-items-start gap-2 p-2'>
                            <i className='bi bi-person dicon fs-5 rounded-circle px-1'></i>
                            <div className='d-flex flex-column gap-2'>
                                <h6 className='fh6' style={{margin:'0px',fontWeight:'bold'}}>Simple</h6>
                                <p className='text-secondary' style={{fontSize:'11px',margin:'0px'}}>Easy to use and designed for you.</p>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex gap-2 gl-box mt-2'>
                        <i className='bi bi-gift giftl fs-4 rounded'></i>
                        <div>
                            <h6 className='fh6' style={{margin:'0px',fontWeight:'bold'}}>Joined thousands of happy users</h6>
                            <p className='text-secondary' style={{fontSize:'11px',margin:'0px'}}>Start your journey with us today!</p>
                        </div>
                    </div>
                </div>
            </div>
        
    </div>
  );
};

export default Login;
