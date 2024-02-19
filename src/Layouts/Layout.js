import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'
import Main from '../Components/Main'
import UserList from '../Models/UserList'
import PersonInfo from '../Models/PersonInfo'
import SignUp from '../SignUp/SignUp'

function Layout() {
    return <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path='/UserList' element={<UserList />} />
        <Route path='/PersonInfo' element={<PersonInfo />} />
        <Route path='/Signup' element={<SignUp />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </>
}

export default Layout
