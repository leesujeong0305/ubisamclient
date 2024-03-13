import React from 'react'
import './Header.css'
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { BsRss } from "react-icons/bs";
import Logout from '../Components/Login/Logout';


const Header = () => {

  return (
    <>
      <header>
        <Navbar expand="lg" className='navbackgroud' style={{backgroundColor: '#375A7F', height: '60px', letterSpacing: '0.5px'}}>
          <Container>
            <Navbar.Brand href="/">
              <span className='iconubi'>Ubi</span>
              <span className='iconsam'>Sam</span>
              < BsRss style ={{ backgroundColor: "skyblue", marginBottom: '20px' }} /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {/* 여기서 왼쪽 정렬 */}
              <div style={{color: 'white'}}><Logout/></div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header