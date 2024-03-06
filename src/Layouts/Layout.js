import React, { useState, useEffect } from 'react'
import axios from "axios";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Header from './Header'
import Footer from './Footer'
import Main from '../Components/Main'
import UserList from '../Models/UserList'
import SignUp from '../SignUp/SignUp'
import Board from '../Board/Board'

import './Layout.css'; // 스타일 시트 임포트
import Today from '../Board/Today';
import MainPlus from '../Components/MainView/MainPlus';
import AdminPage from '../Components/MainView/AdminPage';

function Layout() {
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  //const location = useLocation();
  const accessTokenCheck = () => {
    return axios.get(`http://localhost:8080/`, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then(response => {
        console.log({ response });
        if (response.status === 200) {
            console.log(response.data); // 서버로부터의 응답 처리
            return "success";
        } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
            console.log("403");
            //alert("ID, Password가 비어있습니다.");
            return "fail";
        }
    }).catch(error => {
        //console.log({error});
        if (error.response.status === 403) {
            alert(`${error.response.data.message}`);
        }
    });
  }

  useEffect(() => {
    const accessToken = accessTokenCheck();
    if (accessToken === "success") {
      // 여기에서 accessToken의 유효성을 검증하는 로직을 추가할 수 있습니다.
      // 예: 서버에 요청을 보내 토큰 검증
      // 유효한 토큰이라면 인증 상태를 true로 변경
      dispatch({type:'LOGING', accessToken}); // isAuthenticated를 true로 설정하는 액션
    }
  }, [dispatch]);



  return <>
    <div id="layout-container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/*" element={isAuthenticated ? <MainPlus/> : <Main />} />
          <Route path='/UserList' element={<UserList />} />
          <Route path='/Signup' element={<SignUp />} />
          <Route path='/Board' element={<Board />} />
          <Route path='/Today' element={<Today />} />
          <Route path='/MainPlus' element={<MainPlus />} />
          <Route path='/AdminPage' element={<AdminPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  </>
}

export default Layout
