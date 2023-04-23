import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main/Main';
import Detail from './pages/Detail/Detail';
import Login from './pages/Login/Login';
import Market from './pages/Market/Market';
import Wallet from './pages/Wallet/Wallet';
import Community from './pages/Community/Community';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import NickNameInput from './pages/Login/components/NickNameInput';

function Router() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path='/main/' element={<Main />} />
        <Route path='/login/' element={<Login />} />
        <Route path='/login/nick' element={<NickNameInput />} />
        <Route path='/market/' element={<Market />} />
        <Route path='/wallet/' element={<Wallet />} />
        <Route path='/community/' element={<Community />} />
        <Route path='/detail/' element={<Detail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default Router;
