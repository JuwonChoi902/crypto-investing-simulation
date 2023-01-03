import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Overview from './components/Overview';
import CallBox from './components/CallBox';
import MarketTrade from './components/MarketTrade';
import Chart from './components/Chart';
import BidAndBuy from './components/BidAndBuy';
import { CandleData, CandleDataDetail, CandleData2 } from '../../typing/type';

export default function Detail() {
  const [kline, setKline] = useState<CandleData | undefined>();

  const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1d');

  socket.addEventListener('message', (message) => {
    setKline(JSON.parse(message.data));
  });

  return (
    <OuterBox>
      <CoinDetail>
        <LeftBox>
          <TradeDetail>
            <Overview candleData={kline} />
            <TradeBox>
              <CallBox candleData={kline} />
              <ChartBox>
                <Chart />
                <BidAndBuy />
              </ChartBox>
            </TradeBox>
          </TradeDetail>
        </LeftBox>
        <RightBox>
          <MarketTrade />
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

const OrderInfo = styled.div`
  width: 100%;
  height: 269px;
  border-top: 1px solid #edf0f2;
`;
