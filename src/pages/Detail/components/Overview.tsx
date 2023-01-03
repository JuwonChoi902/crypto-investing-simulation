import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CandleData, CandleData2, CandleDataDetail } from '../../../typing/type';

export default function Overview({ candleData }: CandleData2) {
  const [priceColor, setPriceColor] = useState<string>('');
  const [priceNow, setPriceNow] = useState<string | undefined>();

  useEffect(() => {
    setPriceNow((prev) => prev);
  }, [candleData]);
  return (
    <OuterBox>
      <CoinTitle>BTC/BUSD</CoinTitle>
      <CoinOverview>
        <MarketPrice>
          <Price1>{Number(candleData?.k.c).toFixed(2).toLocaleString()}</Price1>
          <Price2>${Number(candleData?.k.c).toFixed(2).toLocaleString()}</Price2>
        </MarketPrice>
        <OverViewMenu>
          <MenuTitle>24시간 변동</MenuTitle>
          <MenuIndex>
            <span>-289.09</span>
            <span>-1.63%</span>
          </MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24시간 최고가</MenuTitle>
          <MenuIndex>{Number(candleData?.k.h).toFixed(2).toLocaleString()}</MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24시간 최저가</MenuTitle>
          <MenuIndex>{Number(candleData?.k.l).toFixed(2).toLocaleString()}</MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24시간 거래량(BTC)</MenuTitle>
          <MenuIndex>128,259.33</MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24시간 거래량(BUSD)</MenuTitle>
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
