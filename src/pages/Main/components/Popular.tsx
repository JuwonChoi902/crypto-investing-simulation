import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { SymbolTickerTypes, CoinTypes } from '../../../typing/types';
import { updateTickerData } from '../../../utils/functions';
import Coin from './Coin';
import bitCoin from '../images/bitcoin.png';
import ethereum from '../images/ethereum.png';
import usdc from '../images/usd.png';
import tether from '../images/tether.png';
import bnb from '../images/bnb.png';

type PopularProps = {
  setVolume: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const tenDummyCoins: CoinTypes[] = [
  { id: 1, name: 'Bitcoin', nick: 'BTC', symbol: 'btcusdt', imgURL: bitCoin, quantity: 19365700 },
  { id: 2, name: 'Ethereum', nick: 'ETH', symbol: 'ethusdt', imgURL: ethereum, quantity: 120350515 },
  { id: 3, name: 'TetherUS', nick: 'USDT', symbol: 'busdusdt', imgURL: tether, quantity: 82160000000 },
  { id: 4, name: 'BNB', nick: 'BNB', symbol: 'bnbusdt', imgURL: bnb, quantity: 155900000 },
  { id: 5, name: 'USD coin', nick: 'USDC', symbol: 'usdcusdt', imgURL: usdc, quantity: 30390000000 },
];

function Popular({ setVolume }: PopularProps) {
  const [tickers, setTickers] = useState<CoinTypes[]>(tenDummyCoins);
  const [priceColor, setPriceColor] = useState<string[]>(Array.from({ length: tickers.length }));
  const navigate = useNavigate();
  const priceRef = useRef<number[]>([]);
  const [mountTime, setMountTime] = useState<number>(0);
  const [isCoinsRedered, setIsCoinsRendered] = useState<boolean>(false);

  // function printWebSocketTime(url: string) {
  //   const startTime = performance.now();
  //   let openTime = 0;
  //   let firstMessageTime = 0;

  //   const ws = new WebSocket(url);

  //   ws.addEventListener('open', () => {
  //     openTime = performance.now();
  //   });

  //   ws.addEventListener('message', () => {
  //     if (!firstMessageTime) {
  //       firstMessageTime = performance.now();

  //       const connectionTime = (openTime - startTime) / 1000;
  //       const firstMessageDelay = (firstMessageTime - openTime) / 1000;

  //       console.log(`WebSocket 연결 시간: ${connectionTime}ms`);
  //       console.log(`첫 번째 메시지 도착 시간: ${firstMessageDelay}ms`);
  //     }
  //   });

  //   return ws;
  // }

  // const wsUrl = `wss://stream.binance.com:9443/ws/usdcusdt@ticker`;

  // useEffect(() => {
  //   const webSocket = printWebSocketTime(wsUrl);
  // }, []);

  useEffect(() => {
    if (!isCoinsRedered && tickers.every((coin) => coin.price)) {
      setIsCoinsRendered(true);
      const renderTime = (performance.now() - mountTime) / 1000;
      console.log(`All Coin Render Time : ${renderTime}`);
    }
  }, [tickers]);

  // const webSocketsRef = useRef<WebSocket[]>([]);

  // useEffect(() => {
  //   setMountTime(performance.now());

  //   Promise.all<WebSocket>(
  //     tenDummyCoins.map(
  //       (coin, index) =>
  //         new Promise<WebSocket>(() => {
  //           const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`);

  //           socket.addEventListener('message', (event) => {
  //             const data = JSON.parse(event.data) as SymbolTickerTypes;
  //             updateTickerData(index, data, setTickers, setPriceColor, priceRef);
  //           });
  //         }),
  //     ),
  //   );

  //   return () => {
  //     webSocketsRef.current.forEach((webSocket) => {
  //       webSocket.close();
  //     });
  //   };
  // }, []);

  useEffect(() => {
    setMountTime(performance.now());

    const webSockets: WebSocket[] = tenDummyCoins.map(
      (coin) => new WebSocket(`wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`),
    );

    const attachWebSocketListeners = (webSocket: WebSocket, index: number) => {
      webSocket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data) as SymbolTickerTypes;
        updateTickerData(index, data, setTickers, setPriceColor, priceRef);
      });
    };

    webSockets.map((webSocket, index) => attachWebSocketListeners(webSocket, index));

    return () => {
      webSockets.forEach((webSocket) => {
        webSocket.close();
      });
    };
  }, []);

  useEffect(() => {
    const totalVoume = () => tickers.reduce((prev, cur) => prev + Number(cur.volumeOrigin), 0);
    setVolume(totalVoume);
  }, [tickers]);

  return (
    <OuterBox data-testid='popular'>
      <TitleBox>
        <Title>인기 가상화폐</Title>
        <GoMarket onClick={() => navigate('/market')}>가상화폐 더 보러가기</GoMarket>
      </TitleBox>
      <ListBox>
        <CategoryBox>
          <Category>
            <Tap1>Name</Tap1>
            <Tap2>실시간 가격(달러)</Tap2>
            <Tap3>24시간 변동</Tap3>
            <Tap4>24시간 거래량</Tap4>
          </Category>
        </CategoryBox>
        <CryptoList>
          {tickers.map((coin, index) => (
            <Coin key={coin.id} coin={coin} priceColor={priceColor[index]} />
          ))}
        </CryptoList>
      </ListBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  height: 482px;
  padding: 64px 24px;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 64px;
`;
const Title = styled.div`
  font-size: 40px;
  font-weight: 600;
`;
const GoMarket = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.style.grey};

  &:hover {
    cursor: pointer;
    color: black;
  }
`;
const ListBox = styled.div``;
const CategoryBox = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.style.grey};
  padding: 16px;
`;
const Category = styled.div`
  display: flex;
`;
const Tap1 = styled.div`
  width: 100%;
  margin-right: 180px;
`;
const Tap2 = styled.div`
  width: 100%;
  margin-right: 100px;
`;
const Tap3 = styled.div`
  width: 100%;
  margin-right: 100px;
`;
const Tap4 = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;

const CryptoList = styled.div``;

export default React.memo(Popular);
