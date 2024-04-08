import React, { useState, useEffect } from 'react'
import Axios from '../API/AxiosApi';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, updateUserInfo } from '../Redux/Action';
//import { useFooterVisibilityUpdate } from './FooterVisibilityContext'
import Cookies from 'js-cookie';

import Header from './Header'
import Footer from './Footer'
import Main from '../Components/Main'
import UserList from '../Models/UserList'
import SignUp from '../SignUp/SignUp'
import Board from '../Board/Board'
import Today from '../Board/Today';
import MainPlus from '../Components/MainView/MainPlus';
import AdminPage from '../Components/MainView/AdminPage';

import './Layout.css'; // 스타일 시트 임포트
import MyCalenderApp from '../Components/MyCalendar/MyCalenderApp';
import api from '../API/api';

function Layout() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const { authUserId, authUserName, authUserRank } = useSelector(state => state.info);
  //const { updataBoard } = useSelector(state => state.)
  const dispatch = useDispatch();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 추적하는 상태 추가

  const handleLogout = () => {
    // 로그아웃 로직을 구현하세요.
    console.log("로그아웃 처리");
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // 사용자를 로그인 페이지로 리다이렉트할 수 있습니다.
  };

  const initializeAuthState = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken === undefined || accessToken === null) {
      handleLogout();
      setIsLoggedIn(false);
      if (isAuthenticated)
      return;
    }
    verifyToken();
  };

  const verifyToken = async () => {
    console.log("1111.",isLoggedIn);
    // 컴포넌트가 마운트될 때 토큰 유효성 검사를 시도합니다.
    if (isLoggedIn === false) {
        alert("로그인 부터 해주세요");
        return;
      }

    try {
      const accessToken = localStorage.getItem("accessToken");
      await api.get("http://14.58.108.70:8877/token", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("토큰 검증 실패", error);
      // 여기서 리프레시 토큰으로 새 액세스 토큰을 요청합니다.
      refreshToken();
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    // 리프레시 토큰이 없는 경우 즉시 함수를 종료합니다.
    if (!refreshToken) {
        console.log("리프레시 토큰이 없습니다. 로그인이 필요합니다.");
        // 필요한 추가 로직을 여기에 구현하세요.
        return;
    }

    try {
        const response = await api.post("http://14.58.108.70:8877/refresh", {
            refreshToken,
        });
        
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        setIsLoggedIn(true); // 로그인 상태 업데이트
        console.log("새 액세스 토큰이 발급되었습니다.");
    } catch (error) {
        console.error("액세스 토큰 재발급 실패", error);
        handleLogout();
    }
};


useEffect(() => {
  // 로그인 상태 확인 및 초기 인증 상태 설정
  const storedRefreshToken = localStorage.getItem("refreshToken");
  if (storedRefreshToken) {
    setIsLoggedIn(true);
    dispatch(login('LOGIN'));
  }
}, []);

// 로그인 상태 변경을 추적하는 useEffect
useEffect(() => {
  if (isLoggedIn) {
    initializeAuthState();
  }
}, [isLoggedIn]);

  
  //<Footer />
  return <>
    <div id="layout-container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={isAuthenticated ? <Board /> : <Main /> } />
          <Route path='/UserList' element={ <UserList /> } />
          <Route path='/Signup' element={ <SignUp />} />
          <Route path='/Board' element={isAuthenticated ? <Board /> : <Main /> } />
          <Route path='/Today' element={isAuthenticated ? <Today /> : <Main /> } />
          <Route path='/MainPlus' element={isAuthenticated ? <MainPlus /> : <Main /> } />
          <Route path='/AdminPage' element={isAuthenticated ? <AdminPage /> : <Main /> } />
          <Route path='/FullCalendar' element={isAuthenticated ? <MyCalenderApp /> : <Main /> } />
        </Routes>
      </BrowserRouter>
    </div>
  </>
}

export default Layout
