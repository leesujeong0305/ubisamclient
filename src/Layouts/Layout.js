import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'
import Main from '../Components/Main'

function Layout() {
    return <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/*" element={<Main />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </>
}

export default Layout
