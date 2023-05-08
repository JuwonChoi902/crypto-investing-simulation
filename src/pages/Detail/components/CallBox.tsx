import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import switchBoth from '../images/switchBoth.png';
import switchGreen from '../images/switchGreen.png';
import switchRed from '../images/switchRed.png';
import CustomSpinner from './CustomSpinner';

interface CallDataType {
  lastUpdateId: number;
  bids: string[][];
  asks: string[][];
}
type CallBoxProps = {
  price: number | undefined;
  symbol: string;
};

export default function CallBox({ price, symbol }: CallBoxProps) {
  const [book, setBook] = useState<CallDataType>();
  const [priceColor, setPriceColor] = useState<string>('');
  useEffect(() => {
    const newSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth20`);

    newSocket.addEventListener('message', (message) => {
      setBook(JSON.parse(message.data));
    });

    return () => newSocket.close();
  }, []);

  const ref = useRef<number>();
  const prev = ref.current;

  useEffect(() => {
    if (price && prev && price > prev) setPriceColor('green');
    if (price && prev && price < prev) setPriceColor('red');
  }, [price]);

  useEffect(() => {
    ref.current = price;
  });

  const asks = book?.asks.slice(0, 17).reverse();
  const bids = book?.bids.slice(0, 17);

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
        <Asks>
          {asks?.map((el) => (
            <Ask>
              <CallPrice type='asks'>{Number(el[0]).toFixed(2)}</CallPrice>
              <CallAmount>{Number(el[1]).toFixed(5)}</CallAmount>
              <CallTotal>{(+el[0] * +el[1]).toFixed(5)}</CallTotal>
            </Ask>
          ))}
        </Asks>
        {price ? (
          <MarketPrice priceColor={priceColor}>
            <div>{price?.toFixed(2)}</div>
            <span>${price?.toFixed(2)}</span>
          </MarketPrice>
        ) : (
          <CustomSpinner />
        )}
        <Bids>
          {bids?.map((el) => (
            <Bid>
              <CallPrice type='bids'>{Number(el[0]).toFixed(2)}</CallPrice>
              <CallAmount>{Number(el[1]).toFixed(5)}</CallAmount>
              <CallTotal>{(+el[0] * +el[1]).toFixed(5)}</CallTotal>
            </Bid>
          ))}
        </Bids>
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
const Asks = styled.div``;
const Ask = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  height: 20px;
`;

const Bid = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  height: 20px;
`;
const CallPrice = styled.div<{ type: string }>`
  color: ${(props) => (props.type === 'asks' ? props.theme.style.red : props.theme.style.green)};
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

const MarketPrice = styled.div<{ priceColor: string }>`
  display: flex;
  align-items: center;
  height: 35px;

  div {
    font-size: 20px;
    color: ${(props) => props.priceColor};
    margin-right: 4px;
    font-weight: 600;
  }
  span {
    font-size: 12px;
    color: ${(props) => props.theme.style.grey};
  }
`;
const Bids = styled.div``;
