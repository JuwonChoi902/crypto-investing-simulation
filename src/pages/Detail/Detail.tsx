import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Overview from './components/Overview';
import CallBox from './components/CallBox';
import MarketTrade from './components/MarketTrade';
import Chart from './components/Chart';
import BidAndBuy from './components/BidAndBuy';
import OrderInfo from './components/OrderInfo';
import { SymbolTickerTypes } from '../../typing/type';

export default function Detail() {
  const [symbolTicker, setSymbolTicker] = useState<SymbolTickerTypes | undefined>();

  useEffect(() => {
    const newSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    newSocket.addEventListener('message', (message) => {
      setSymbolTicker(JSON.parse(message.data));
    });
  }, []);

  const price = Number(symbolTicker?.c);

  return (
    <OuterBox>
      <CoinDetail>
        <LeftBox>
          <TradeDetail>
            <Overview symbolTicker={symbolTicker} />
            <TradeBox>
              <CallBox price={price} />
              <ChartBox>
                <Chart />
                <BidAndBuy />
              </ChartBox>
            </TradeBox>
          </TradeDetail>
        </LeftBox>
        <RightBox>
          <MarketTrade price={price} />
        </RightBox>
      </CoinDetail>
      <OrderInfo />
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
