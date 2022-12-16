import React from 'react';
import styled from 'styled-components';

export default function Overview() {
  return (
    <OuterBox>
      <CoinTitle>BTC/BUSD</CoinTitle>
      <CoinOverview>
        <MarketPrice>
          <Price1>17,405.05</Price1>
          <Price2>$17,405.05</Price2>
        </MarketPrice>
        <OverViewMenu>
          <MenuTitle>24h Change</MenuTitle>
          <MenuIndex>
            <span>-289.09</span>
            <span>-1.63%</span>
          </MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24h High</MenuTitle>
          <MenuIndex>17,748.96</MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24h Low</MenuTitle>
          <MenuIndex>17,274,78</MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24h Volume(BTC)</MenuTitle>
          <MenuIndex>128,259.33</MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24h Volume(BUSD)</MenuTitle>
          <MenuIndex>2,243,339,938.56</MenuIndex>
        </OverViewMenu>
      </CoinOverview>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 10px 16px;
  border-bottom: 1px solid #edf0f2;
`;
const CoinTitle = styled.div`
  ${(props) => props.theme.variables.flex()}
  font-size: 20px;
  font-weight: 600;
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 1px solid #edf0f2;
  padding-right: 24px;
  margin-right: 24px;
`;
const CoinOverview = styled.div`
  display: flex;
`;
const MarketPrice = styled.div`
  padding-right: 32px;
`;
const Price1 = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.style.green};
  font-weight: 600;
  margin-bottom: 5px;
`;
const Price2 = styled.div`
  font-size: 12px;
  font-weight: 600;
`;
const OverViewMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  padding-right: 32px;
  font-weight: 600;

  span {
    color: ${(props) => props.theme.style.red};
    margin-right: 5px;
  }
`;
const MenuTitle = styled.div`
  color: ${(props) => props.theme.style.grey};
  margin-bottom: 5px;
`;

const MenuIndex = styled.div``;
