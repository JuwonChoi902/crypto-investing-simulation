import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import { SymbolTickerTypes } from '../../typing/type';
import Overview from './components/Overview';
import CallBox from './components/CallBox';
import MarketTrade from './components/MarketTrade';
import Chart from './components/Chart';
import BidAndBuy from './components/BidAndBuy';
import OrderInfo from './components/OrderInfo';
import Apologize from './components/Apologize';

export default function Detail() {
  const [symbolTicker, setSymbolTicker] = useState<SymbolTickerTypes | undefined>();
  const [isApVisible, setIsApVisible] = useState<boolean>(false);
  const { symbol } = useLocation().state || 'btcusdt';

  useEffect(() => {
    const newSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);

    newSocket.addEventListener('message', (message) => {
      setSymbolTicker(JSON.parse(message.data));
    });
  }, []);

  useEffect(() => {
    const setTime = setTimeout(() => {
      setIsApVisible(true);
    }, 3000);

    return () => clearTimeout(setTime);
  }, []);

  const price = Number(symbolTicker?.c);

  return (
    <OuterBox>
      <CoinDetail>
        <LeftBox>
          <TradeDetail>
            <Overview symbolTicker={symbolTicker} symbol={symbol} />
            <TradeBox>
              <CallBox price={price} symbol={symbol} />
              <ChartBox>
                <Chart symbol={symbol} />
                <BidAndBuy />
              </ChartBox>
            </TradeBox>
          </TradeDetail>
        </LeftBox>
        <RightBox>
          <MarketTrade price={price} symbol={symbol} />
        </RightBox>
      </CoinDetail>
      <OrderInfo />
      {isApVisible ? <Apologize /> : null};
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  border-top: 1px solid #edf0f2;
`;
const CoinDetail = styled.div`
  display: flex;
`;
const LeftBox = styled.div``;
const TradeDetail = styled.div``;
const TradeBox = styled.div`
  display: flex;
`;
const ChartBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const RightBox = styled.div`
  border-left: 1px solid #edf0f2;
`;
