import React from 'react';
import styled from 'styled-components';

export default function OrderInfo() {
  return (
    <OuterBox>
      <Header>
        <OpenOrders />
        <OrderHistory />
        <TradeHistory />
        <Funds />
      </Header>
      <MainBox>
        <Categories />
        <Contents />
      </MainBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 100%;
  height: 269px;
  border-top: 1px solid #edf0f2;
`;

const Header = styled.div``;
const OpenOrders = styled.div``;
const OrderHistory = styled.div``;
const TradeHistory = styled.div``;
const Funds = styled.div``;
const MainBox = styled.div``;
const Categories = styled.div``;
const Contents = styled.div``;
