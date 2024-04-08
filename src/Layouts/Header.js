import React, { useState, useEffect } from 'react'
import './Header.css'
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { BsRss } from "react-icons/bs";
import Logout from '../Components/Login/Logout';


const Header = () => {
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth);
  const [user, setUser] = useState('');
  const [team, setTeam] = useState('');
  const [rank, setRank] = useState('');

  useEffect(() => {
    if (isAuthenticated)
    {
      setUser(localStorage.getItem('userToken'));
      //setTeam(localStorage.getItem('userTeamToken'));
      //setRank(localStorage.getItem('userRankToken'));
    } else {
      setUser('');
      //setTeam('');
      //setRank('');
    }
    
  }, [isAuthenticated])



//
//<div className="header-profile-team mt-1">{team}</div>

//<span className="ml-2 header-profile-rank">{rank}</span>
  return (
    <>
      <header>
        <Navbar expand="lg" className='navbackgroud'>
          <Navbar.Brand href="/" className='ms-4'>
            <span className='iconub'>U</span>
            <span className='iconubi'>bi</span>
            <span className='icons'>S</span>
            <span className='iconsam'>am</span>
            <BsRss className='navbar-logo-icon' />
          </Navbar.Brand>
          <Navbar.Collapse className="">
            <Nav defaultActiveKey='/' className=''>
              <Nav.Item>
                {isAuthenticated ? <Nav.Item><Nav.Link className='ms-5' href="/">대시보드</Nav.Link></Nav.Item> : <div className='disabled me-5'></div>}
              </Nav.Item>
              <div className="divider"></div>
              <Nav.Item>
                {isAuthenticated ? <Nav.Link className='nav-items  sm-8' eventKey="link-1" href="/FullCalendar">유저보드</Nav.Link> : <div className='disabled me-5'></div>}
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>

          {isAuthenticated ?
         
            <div className="d-flex  header-profile-user">
              <span>{user}</span>
              <div>
              </div>
            </div>
          : <div></div> }
          
          {isAuthenticated ?
            <Nav.Link className='justify-content-end me-4 bs-auto'><Logout /></Nav.Link> : <div className='disabled me-5'></div>}
          <Navbar.Toggle />
        </Navbar>
      </header>
    </>
  );
};

export default Header