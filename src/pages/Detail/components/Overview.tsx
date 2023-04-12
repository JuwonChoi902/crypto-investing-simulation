import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SymbolTickerTypes } from '../../../typing/type';

type OverviewProps = {
  symbolTicker: SymbolTickerTypes | undefined;
};

export default function Overview({ symbolTicker }: OverviewProps) {
  const [priceColor, setPriceColor] = useState<string>('');

  const price = Number(symbolTicker?.c);
  const ref = useRef<number>();
  const prev = ref.current;

  useEffect(() => {
    if (price && prev && price > prev) setPriceColor('green');
    if (price && prev && price < prev) setPriceColor('red');
  }, [price]);

  useEffect(() => {
    ref.current = price;
  });

  return (
    <OuterBox>
      <CoinTitle>BTC/BUSD</CoinTitle>
      <CoinOverview>
        <MarketPrice>
          <Price1 priceColor={priceColor}>
            {Number(symbolTicker?.c).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Price1>
          <Price2>
            $
            {Number(symbolTicker?.c).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Price2>
        </MarketPrice>
        <OverViewMenu>
          <MenuTitle>24시간 변동</MenuTitle>
          <ChangeInADay whatColor={symbolTicker?.p}>
            <span>
              {Number(symbolTicker?.p).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span>
              {Number(symbolTicker?.P) >= 0 ? '+' : null}
              {Number(symbolTicker?.P).toFixed(2)}%
            </span>
          </ChangeInADay>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24시간 최고가</MenuTitle>
          <MenuIndex>{Number(symbolTicker?.h).toLocaleString()}</MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24시간 최저가</MenuTitle>
          <MenuIndex>{Number(symbolTicker?.l).toLocaleString()}</MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24시간 거래량(BTC)</MenuTitle>
          <MenuIndex>
            {Number(symbolTicker?.v).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </MenuIndex>
        </OverViewMenu>
        <OverViewMenu>
          <MenuTitle>24시간 거래량(BUSD)</MenuTitle>
          <MenuIndex>
            {Number(symbolTicker?.q).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </MenuIndex>
        </OverViewMenu>
      </CoinOverview>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  align-items: center;
  width: 870px;
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
  width: 72px;
  padding-right: 32px;
`;
const Price1 = styled.div<{ priceColor: string }>`
  font-size: 16px;
  color: ${(props) => props.priceColor};
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
`;
const MenuTitle = styled.div`
  color: ${(props) => props.theme.style.grey};
  margin-bottom: 5px;
`;

const MenuIndex = styled.div``;
const ChangeInADay = styled.div<{ whatColor: string | undefined }>`
  color: ${(props) => (Number(props.whatColor) >= 0 ? props.theme.style.green : props.theme.style.red)};

  span {
    margin-right: 5px;
  }
`;
