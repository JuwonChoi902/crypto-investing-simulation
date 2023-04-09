import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CandleData2 } from '../../../typing/type';
import switchBoth from '../images/switchBoth.png';
import switchGreen from '../images/switchGreen.png';
import switchRed from '../images/switchRed.png';

interface CallsData {
  id: number;
  price: number;
  amount: number;
  total: number;
}

const CallsDataUp: CallsData[] = [];
const CallsDataDown: CallsData[] = [];
for (let i = 1; i <= 17; i += 1) {
  CallsDataUp.push({
    id: i,
    price: 17021 + i,
    amount: i,
    total: i,
  });

  CallsDataDown.push({
    id: i,
    price: 17021 - i,
    amount: i,
    total: i,
  });
}

const price = 17020.01;

export default function CallBox({ candleData }: CandleData2) {
  const [book, setBook] = useState();

  useEffect(() => {
    const newSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth20');

    newSocket.addEventListener('message', (message) => {
      setBook(JSON.parse(message.data));
    });
  }, []);

  console.log(book);

  return (
    <OuterBox>
      <SwitchBox>
        <img src={switchBoth} alt='switchBoth' />
        <img src={switchGreen} alt='switchGreen' />
        <img src={switchRed} alt='switchRed' />
      </SwitchBox>
      <CallTitle>
        <TitlePrice>가격(BUSD)</TitlePrice>
        <TitleAmount>수량(BTC)</TitleAmount>
        <TitleTotal>총액</TitleTotal>
      </CallTitle>
      <Calls>
        <HighCalls>
          {CallsDataUp.map((el) => (
            <Call>
              <CallPrice whatColor={el.price}>{el.price}</CallPrice>
              <CallAmount>{el.amount}</CallAmount>
              <CallTotal>{el.total}</CallTotal>
            </Call>
          ))}
        </HighCalls>
        <MarketPrice>
          <div>{Number(candleData?.k.c).toFixed(2).toLocaleString()}</div>
          <span>${Number(candleData?.k.c).toFixed(2).toLocaleString()}</span>
        </MarketPrice>
        <LowCalls>
          {CallsDataDown.map((el) => (
            <Call>
              <CallPrice whatColor={el.price}>{el.price}</CallPrice>
              <CallAmount>{el.amount}</CallAmount>
              <CallTotal>{el.total}</CallTotal>
            </Call>
          ))}
        </LowCalls>
      </Calls>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  padding: 0px 16px;
  padding-bottom: 8px;
  width: 277px;
  border-right: 1px solid #edf0f2;
`;
const SwitchBox = styled.div`
  display: flex;
  height: 24px;
  padding: 16px 0px;

  img {
    width: 20px;
    height: 20px;
    padding: 0px 4px;
    margin: 0px 6px;

    &:hover {
      cursor: pointer;
    }
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
const TitleTotal = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;
const Calls = styled.div``;
const HighCalls = styled.div``;
const Call = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  height: 20px;
`;
const CallPrice = styled.div<{ whatColor: number }>`
  color: ${(props) => (props.whatColor > price ? props.theme.style.red : props.theme.style.green)};
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

const MarketPrice = styled.div`
  display: flex;
  align-items: center;
  height: 35px;

  div {
    font-size: 20px;
    color: ${(props) => props.theme.style.red};
    margin-right: 4px;
    font-weight: 600;
  }
  span {
    font-size: 12px;
    color: ${(props) => props.theme.style.grey};
  }
`;
const LowCalls = styled.div``;
