import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'
import Main from '../Components/Main'
import UserList from '../Models/UserList'
import SignUp from '../SignUp/SignUp'
import Board from '../Board/Board'

import './Layout.css'; // 스타일 시트 임포트
import Today from '../Board/Today';
import MainPlus from '../Components/MainView/MainPlus';

function Layout() {
  return <>
    <div id="layout-container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/*" element={<Main />} />
          <Route path='/UserList' element={<UserList />} />
          <Route path='/Signup' element={<SignUp />} />
          <Route path='/Board' element={<Board />} />
          <Route path='/Today' element={<Today />} />
          <Route path='/MainPlus' element={<MainPlus />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  </>
}

export default Layout
