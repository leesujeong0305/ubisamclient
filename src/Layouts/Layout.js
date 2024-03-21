import React, { useState, useEffect } from 'react'
import Axios from '../API/AxiosApi';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, updateUserInfo } from '../Redux/Action';
import { useFooterVisibilityUpdate } from './FooterVisibilityContext'
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
import FullCalendarComponent from '../Components/Calendar/FullCalendarComponent';

import './Layout.css'; // 스타일 시트 임포트

function Layout() {
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth);
  const { authUserId, authUserName, authUserRank } = useSelector(state => state.info);
  //const { updataBoard } = useSelector(state => state.)
  const dispatch = useDispatch();
  const toggleFooterVisibility = useFooterVisibilityUpdate();
  
  const CheckAuthToken = async () => {
    const access = Cookies.get('accessToken');
    if (access === undefined) {
      return
    }
    
    Axios.defaults.headers.common.Authorization = `Bearer ${access}`;
    //const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const response = await Axios.get(`http://localhost:8080/token`, {
        withCredentials: true,
        headers: {
          
          "Content-Type": "application/json",
        }
      });
      console.log(response);
      if (response.status === 204 || response.status === 200) {
        return "success";
      } else {
        console.log(response);
        //refreshToken이 만료된것으로 판단 Token제거
        Cookies.remove('accessToken'); //혹시 cookie 삭제되지 않은게 있을까봐 넣어줌(없어도 잘됨)
        Cookies.remove('refreshToken');
        localStorage.removeItem('userToken');
        alert(`로그인 시간 만료. 다시 로그인 해주세요`);
        return null;
      }
      
    } catch (error) {
      console.log({error});
      if (error.response.status === 403) {
          alert(`${error.response.data.message}`);
      }
      return null;
    }

  }

  // useEffect(() => {
  //   // 페이지가 마운트될 때 Footer를 숨김
  //   toggleFooterVisibility(false);
  //   return () => {
  //     // 페이지가 언마운트될 때 Footer를 다시 표시
  //     toggleFooterVisibility(true);
  //   };

  // });

  useEffect(() => {
    const initializeAuthState = async () => {
      const userInfo = await CheckAuthToken();
      if (userInfo === 'success') {
        dispatch(login('LOGIN'));
        //dispatch(updateUserInfo());
      }
    };
    initializeAuthState();
  }, [dispatch]);

  


  //{isAuthenticated ? <MainPlus/> : <Main />} FullCalendarComponent
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
          <Route path='/FullCalendar' element={isAuthenticated ? <FullCalendarComponent /> : <Main /> } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  </>
}

export default Layout
