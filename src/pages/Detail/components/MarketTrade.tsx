import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { TradeDataTypes } from '../../../typing/types';

type MarketTradeBoxProps = {
  price: number | undefined;
  symbol: string;
};

export default function MarketTrade({ price, symbol }: MarketTradeBoxProps) {
  const [tradeData, setTradeData] = useState<TradeDataTypes>();

  useEffect(() => {
    const newSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@aggTrade`);

    newSocket.addEventListener('message', (message) => {
      setTradeData(JSON.parse(message.data));
    });

    return () => newSocket.close();
  }, []);

  const ref = useRef<TradeDataTypes[]>([]);

  useEffect(() => {
    if (tradeData && ref.current.length < 30) ref.current.unshift(tradeData);
    if (tradeData && ref.current.length >= 30) {
      ref.current.pop();
      ref.current.unshift(tradeData);
    }
  });

  const dateParsing = (num: number): string => {
    const date = new Date(num);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <OuterBox>
      <TitleBox>
        <ShowMarketTrade>시장 체결</ShowMarketTrade>
        <ShowMyTrade>나의 체결</ShowMyTrade>
      </TitleBox>
      <CallTitle>
        <TitlePrice>가격(BUSD)</TitlePrice>
        <TitleAmount>수량(BTC)</TitleAmount>
        <TradeTime>시간</TradeTime>
      </CallTitle>
      <Calls>
        <Trades>
          {ref.current.map((el) => (
            <Call>
              <CallPrice price={price} traded={Number(el.p)}>
                {Number(el.p).toFixed(2)}
              </CallPrice>
              <CallAmount>{Number(el.q).toFixed(5)}</CallAmount>
              <CallTotal>{dateParsing(el.T)}</CallTotal>
            </Call>
          ))}
        </Trades>
      </Calls>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  padding: 0px 16px;
  padding-bottom: 8px;
  width: 100%;
  border-right: 1px solid #edf0f2;
`;
const TitleBox = styled.div`
  display: flex;
  padding: 16px 0px;
  font-size: 14px;
`;

const ShowMarketTrade = styled.div`
  color: ${(props) => props.theme.style.yellow};
  padding: 16px 1px 10px 1px;
  margin-right: 16px;

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowMyTrade = styled.div`
  color: #848e9c;
  padding: 16px 1px 10px 1px;
  margin-right: 85px;

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const CallTitle = styled.div`
  display: flex;
  font-size: 12px;
  height: 20px;
  color: ${(props) => props.theme.style.grey};
`;
const TitlePrice = styled.div`
  width: 100%;
`;
const TitleAmount = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;
const TradeTime = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;
const Calls = styled.div``;
const Trades = styled.div``;
const Call = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  height: 20px;
`;
const CallPrice = styled.div<{ price: number | undefined; traded: number }>`
  color: ${(props) =>
    props.price && props.traded >= props.price ? props.theme.style.red : props.theme.style.green};
  width: 100%;
`;

const CallAmount = styled.div`
  display: flex;
  justify-content: end;
  color: #474d57;
  width: 100%;
`;
const CallTotal = styled.div`
  display: flex;
  justify-content: end;
  color: #474d57;
  width: 100%;
`;
