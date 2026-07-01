import React, { useEffect, useState } from 'react';
import './Register.css';
import {FcGoogle} from 'react-icons/fc';
import registerImg from '../../assets/register.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { registerFunction } from '../../services/authService';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [data,setData] = useState({
        name:'',
        email:'',
        password:'',
        provider:'LOCAL'
    });
    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({...prev,[name]:value}));
    };
    const onSignUpHandler = async()=>{
        try {
            setLoading(true);
            const response = await registerFunction(data);
            toast.success("Registration successfull, please login");
            setLoading(false);
            navigate('/login');
        } catch (error) {
            setLoading(false);
            toast.error("Email already exists");
        }
    }
    const onSubmitHandler = (event)=>{
        event.preventDefault();
    }
  return (
    <div className='main-container d-flex justify-content-center'>
        
            <div className='form-container d-flex flex-column gap-3'>
                <div className='d-flex flex-column align-items-center'>
                    <div className='d-flex gap-1 align-items-center'>
                        <i className='bi bi-chat chat-icon'></i>
                        <h2 className='fh2 pt-1'>Chatter</h2>
                    </div>
                    <h3 className='fh3'>Create Account</h3>
                    <small className='text-secondary'>Sign up today and get started</small>
                </div>
                <form onSubmit={onSubmitHandler} className='d-flex gap-3 align-items-start justify-content-center flex-column form-div'>
                    <div className='flex-start'>
                        <label htmlFor="name" className='fw-bold'><small>Name</small></label>
                        <div htmlFor="name" className='input-div'>
                            <i className='bi bi-person ficon fs-5 text-secondary'></i>
                            <input type="text" placeholder='John Doe' value={data.name} onChange={onChangeHandler} id="name" name='name' className='finput'/>
                        </div>
                    </div>
                    <div className='flex-start'>
                        <label htmlFor="email" className='fw-bold'><small>Email</small></label>
                        <div htmlFor="email" className='input-div'>
                            <i className='bi bi-envelope ficon fs-5 text-secondary'></i>
                            <input type="email" placeholder='example@email.com' value={data.email} onChange={onChangeHandler} id='email' name='email' className='finput'/>
                        </div>
                    </div>
                    <div className='flex-start'>
                        <label htmlFor="password" className='fw-bold'><small>Password</small></label>
                        <div htmlFor="password" className='input-div'>
                            <i className='bi bi-lock ficon fs-5 text-secondary'></i>
                            <input type="password" placeholder='Enter your password' value={data.password} onChange={onChangeHandler} id='password' name='password' className='finput'/>
                        </div>
                    </div>
                    <button className='submit' onClick={onSignUpHandler} disabled={loading}>
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                ></span>
                                SignUping...
                            </>
                        ) : (
                            "Sign up"
                        )}
                    </button>
                    <div className='d-flex align-items-center' style={{width:'100%'}}>
                        <div className='fline'></div>
                        <small className='ft px-1 text-secondary'>or continue with</small>
                        <div className='fline'></div>
                    </div>
                    <button className='gsubmit d-flex align-items-center justify-content-center gap-1'>
                        <FcGoogle className='fs-4'/> <span>Google</span>
                    </button>
                    <div style={{width:'100%'}} className='d-flex justify-content-center'>
                        <small className='ft me-1'>Already have an account?</small> <small className='ft hov' style={{color:'rgb(2, 189, 189)'}} onClick={()=>navigate('/login')}><u>Sign in</u></small>
                    </div>
                </form>
            </div>
            <div className='design-container text-white pt-4 d-none d-lg-flex flex-column align-items-center'>
                <h3 className='heading'>Everything you need,</h3>
                <h3 className='heading'>to go further.</h3>
                <div className='hline rounded-pill'></div>
                <img src={registerImg} alt="desgin" className='d-img'/>
                <div className='dc'>
                    <div className='d-flex gap-2 ps-1'>
                        <div className='d-div d-flex align-items-start gap-2 py-2 px-1'>
                            <i className='bi bi-shield dicon fs-5'></i>
                            <div className='d-flex flex-column gap-2'>
                                <h6 style={{margin:'0px',fontWeight:'bold'}}>Secure</h6>
                                <p style={{fontSize:'11px',margin:'0px'}}>Your data is safe and protected.</p>
                            </div>
                        </div>
                        <div className='d-div d-flex align-items-start gap-2 p-2'>
                            <i className='bi bi-lightning dicon fs-5 px-2'></i>
                            <div className='d-flex flex-column gap-2'>
                                <h6 style={{margin:'0px',fontWeight:'bold'}}>Fast</h6>
                                <p style={{fontSize:'11px',margin:'0px'}}>Quick access and smooth experience.</p>
                            </div>
                        </div>
                        <div className='d-div d-flex align-items-start gap-2 p-2'>
                            <i className='bi bi-person dicon fs-5 px-1'></i>
                            <div className='d-flex flex-column gap-2'>
                                <h6 style={{margin:'0px',fontWeight:'bold'}}>Simple</h6>
                                <p style={{fontSize:'11px',margin:'0px'}}>Easy to use and designed for you.</p>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex gap-2 g-box mt-2'>
                        <i className='bi bi-gift gift fs-4 rounded'></i>
                        <div className='dc'>
                            <h6 style={{margin:'0px',fontWeight:'bold',color:'rgb(244, 238, 238)'}}>Joined thousands of happy users</h6>
                            <p style={{fontSize:'11px',margin:'0px'}}>Start your journey with us today!</p>
                        </div>
                    </div>
                </div>
            </div>
        
    </div>
  );
};

export default Register;
