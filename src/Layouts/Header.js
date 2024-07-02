import React, { useState, useEffect } from 'react'
import './Header.css'
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { BsRss } from "react-icons/bs";
import Logout from '../Components/Login/Logout';
import { updateUser } from '../Redux/Store';
import GetUserInfo from '../API/GetUserInfo';

const Header = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState('');
  const isLogged = useSelector(state => state.auth.isLoggedIn);
  const { authUserId, authUserName, authUserRank, authUserTeam } = useSelector(state => state.userInfo);

  const positions = ['사원', '대리', '과장', '차장', '부장', '상무', '사장'];
  const position = (rank) => {
    return positions.indexOf(rank) > positions.indexOf('과장');
  }

  useEffect(() => {
    const updateUserInfo = async () => {
      const data = await GetUserInfo();
      dispatch(updateUser(data));
    };

    if (isLogged) {
      setUser(localStorage.getItem('userToken'));
      updateUserInfo();
    } else {
      setUser('');
    }

  }, [isLogged])


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
            <Nav defaultActiveKey='/' className='col'>
              <Nav.Item>
                {isLogged ? <Nav.Item><Nav.Link className='ms-5' href="/">대시보드</Nav.Link></Nav.Item> : <div className='disabled me-5'></div>}
              </Nav.Item>
              <div className="divider"></div>
              <Nav.Item>
                {isLogged ? <Nav.Link className='' eventKey="link-1" href="/FullCalendar">유저보드</Nav.Link> : <div className='disabled me-5'></div>}
              </Nav.Item>

              {isLogged && position(authUserRank) &&
                <>
                  <div className='divider'></div>
                  <Nav.Item>
                    <Nav.Link className='' eventKey="link-1" href="/AdminLayout">관리자 Board</Nav.Link>
                  </Nav.Item>
                </>
              }

            </Nav>
          </Navbar.Collapse>

          {isLogged ?

            <div className="d-flex  header-profile-user">
              <span>{authUserName}</span>
              <div>
              </div>
            </div>
            : <div></div>}

          {isLogged ?
            <Nav.Link className='justify-content-end me-4 bs-auto'><Logout /></Nav.Link> : <div className='disabled me-5'></div>}
          <Navbar.Toggle />
        </Navbar>
      </header>
    </>
  );
};

export default Header