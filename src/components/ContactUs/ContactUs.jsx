import React, { useState } from 'react';
import './ContactUs.css';
import { sendMail } from '../../services/mailService';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [mail,setMail] = useState({
    email: "",
    name: "",
    message: ""
  });
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setMail(prev => ({...prev,[name]:value}));
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await sendMail(mail);
      if(response.status === 200){
        toast.success("Mail sent successfully");
        setMail({
          email: "",
          name: "",
          message: ""
        });
      }
    } catch (error) {
      toast.error("Please try again mail not sent due to some error.");
      console.log(error);
    }
  }
  return (
    <div className='d-flex flex-column contact-us pt-3'>
      <h3 className='cu'>Contact Us</h3>
      <form onSubmit={onSubmitHandler} className='px-4 pt-3 d-flex flex-column gap-2'>
        <label htmlFor="email" className='cfl'>Email</label>
        <input type="text" name='email' id='email' value={mail.email} onChange={onChangeHandler} className='cu-input px-3 py-2 rounded-pill' required/>
        <label htmlFor="name" className='cfl'>Name</label>
        <input type="text" name='name' id='name' value={mail.name} onChange={onChangeHandler} className='cu-input px-3 py-2 rounded-pill' required/>
        <label htmlFor="message" className='cfl'>Message</label>
        <textarea name="message" id="message" value={mail.message} onChange={onChangeHandler} className='cu-textarea px-3 py-2 rounded' required></textarea>
        <button className='btn btn-success mt-3' type='submit'>Send</button>
      </form>
    </div>
  );
};

export default ContactUs;
