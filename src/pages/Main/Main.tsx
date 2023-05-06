import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Login from '../Login/Login';
import BillBoard from './components/BillBoard';
import Popular from './components/Popular';
import NeedHelp from './components/NeedHelp';
import WannaRich from './components/WannaRich';

export default function Main() {
  const loginUserToken = localStorage.getItem('accessToken');
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) setIsLogin(true);
    else setIsLogin(false);
  }, [localStorage]);

  return (
    <OuterBox>
      {isLogin ? null : <WannaRich />}
      <BillBoard />
      <Popular />
      <NeedHelp />
    </OuterBox>
  );
}

const OuterBox = styled.div``;
