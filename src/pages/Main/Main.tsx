import React from 'react';
import styled from 'styled-components';
import Login from '../Login/Login';
import BillBoard from './components/BillBoard';
import Popular from './components/Popular';
import NeedHelp from './components/NeedHelp';
import WannaRich from './components/WannaRich';

export default function Main() {
  return (
    <OuterBox>
      <Login />
      <BillBoard />
      <Popular />
      <NeedHelp />
      <WannaRich />
    </OuterBox>
  );
}

const OuterBox = styled.div``;
