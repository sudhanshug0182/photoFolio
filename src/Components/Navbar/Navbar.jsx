import React from 'react';
import "./navbar.css";
import logoImages from '../../assets/logo';

export default function Navbar() {
  return (
    <>
    <div className="header">

      <div className="icon">
        <img src={logoImages.logo} alt="logo"/>
        <span className="gradient-text">PhotoFolio</span>
      </div>

      {/* <div className="profile">
        <button className='button'>Login</button>
        <button className='button'>Sign Up</button>
      </div> */}

    </div>
    </>
  )
}
