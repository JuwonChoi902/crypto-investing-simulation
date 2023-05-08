import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TopListing from './components/TopListing';
import CoinList from './components/CoinList';
import { CoinTypes, SymbolTickerTypes } from '../../typing/types';
import chart from './images/chart.png';
import bitCoin from './images/bitcoin.png';
import bnb from './images/bnb.png';
import ethereum from './images/ethereum.png';
import tether from './images/tether.png';
import usd from './images/usd.png';
import doge from './images/doge.png';
import cardano from './images/cardano.png';
import polygon from './images/polygon.png';
import solana from './images/solana.png';
import ripple from './images/ripple.png';
import id from './images/id.png';
import syn from './images/syn.png';
import sui from './images/sui.jpeg';

const tenDummyCoins: CoinTypes[] = [
  { id: 1, name: 'Bitcoin', nick: 'BTC', symbol: 'btcusdt', imgURL: bitCoin, quantity: 19365700 },
  { id: 2, name: 'Ethereum', nick: 'ETH', symbol: 'ethusdt', imgURL: ethereum, quantity: 120350515 },
  { id: 3, name: 'TetherUS', nick: 'USDT', symbol: 'busdusdt', imgURL: tether, quantity: 82160000000 },
  { id: 4, name: 'BNB', nick: 'BNB', symbol: 'bnbusdt', imgURL: bnb, quantity: 155900000 },
  { id: 5, name: 'USD coin', nick: 'USDC', symbol: 'usdcusdt', imgURL: usd, quantity: 30390000000 },
  { id: 6, name: 'Ripple', nick: 'XRP', symbol: 'xrpusdt', imgURL: ripple, quantity: 100000000000 },
  { id: 7, name: 'Cardano', nick: 'ADA', symbol: 'adausdt', imgURL: cardano, quantity: 63000000000 },
  { id: 8, name: 'Dogecoin', nick: 'DOGE', symbol: 'dogeusdt', imgURL: doge, quantity: 132670764300 },
  { id: 9, name: 'Polygon', nick: 'MATIC', symbol: 'maticusdt', imgURL: polygon, quantity: 9249469069 },
  { id: 10, name: 'Solana', nick: 'SOL', symbol: 'solusdt', imgURL: solana, quantity: 260000000 },
  { id: 11, name: 'Space ID', nick: 'ID', symbol: 'idusdt', imgURL: id, quantity: 0 },
  { id: 12, name: 'SYN', nick: 'Synapse', symbol: 'synusdt', imgURL: syn, quantity: 0 },
  { id: 13, name: 'Sui', nick: 'SUI', symbol: 'suiusdt', imgURL: sui, quantity: 0 },
];

const newAndPopCoins: CoinTypes[] = [
  { id: 11, name: 'Space ID', nick: 'ID', symbol: 'idusdt', imgURL: id, quantity: 0 },
  { id: 12, name: 'SYN', nick: 'Synapse', symbol: 'synusdt', imgURL: syn, quantity: 0 },
  { id: 13, name: 'Sui', nick: 'SUI', symbol: 'suiusdt', imgURL: sui, quantity: 0 },
  { id: 6, name: 'Ripple', nick: 'XRP', symbol: 'xrpusdt', imgURL: ripple, quantity: 100000000000 },
  { id: 7, name: 'Cardano', nick: 'ADA', symbol: 'adausdt', imgURL: cardano, quantity: 63000000000 },
  { id: 8, name: 'Dogecoin', nick: 'DOGE', symbol: 'dogeusdt', imgURL: doge, quantity: 132670764300 },
];

export default function Market() {
  const [tickers, setTickers] = useState<CoinTypes[]>(tenDummyCoins);
  const [priceColor, setPriceColor] = useState<string[]>(Array.from({ length: tickers.length }));
  const priceRef = useRef<number[]>([]);

  const unitParsing = (num: string) => {
    const temp = Number(num);
    let [divideNum, resString, fractionDigit] = [1, '', 2];
    if (temp >= 1000000000) {
      [divideNum, resString] = [1000000000, 'B'];
    } else if (temp < 1000000000 && temp >= 1000000) {
      [divideNum, resString] = [1000000, 'M'];
    } else if (temp < 1000000 && temp >= 1000) {
      [divideNum, resString] = [1000, 'K'];
    } else fractionDigit = 4;

    return `${(temp / divideNum).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: fractionDigit,
    })}${resString}`;
  };

  useEffect(() => {
    const webSockets: WebSocket[] = tenDummyCoins.map(
      (coin) => new WebSocket(`wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`),
    );

    const updateTickerData = (index: number, data: SymbolTickerTypes) =>
      new Promise<Array<CoinTypes | undefined>>((resolve) => {
        setTickers((prevTickers) => {
          const updatedTickers = [...prevTickers];
          const prevPrice = priceRef.current[index];
          const currentPrice = Number(data.c);

          if (prevPrice !== undefined) {
            if (currentPrice > prevPrice) {
              setPriceColor((prevColors) => {
                const colors = [...prevColors];
                colors[index] = 'green';
                return colors;
              });
            } else if (currentPrice < prevPrice) {
              setPriceColor((prevColors) => {
                const colors = [...prevColors];
                colors[index] = 'red';
                return colors;
              });
            } else {
              setPriceColor((prevColors) => {
                const colors = [...prevColors];
                colors[index] = 'black';
                return colors;
              });
            }
          }

          priceRef.current[index] = currentPrice;

          updatedTickers[index] = {
            ...updatedTickers[index],
            price: unitParsing(data.c),
            dayChange: Number(data.P) > 0 ? `+${Number(data.P).toFixed(2)}` : `${Number(data.P).toFixed(2)}%`,
            volume: unitParsing(data.q),
            marketCap: unitParsing(String(Number(data.c) * updatedTickers[index].quantity)),
          };

          return updatedTickers;
        });
        resolve([]);
      });

    const attachWebSocketListeners = (webSocket: WebSocket, index: number) =>
      new Promise<void>((resolve) => {
        webSocket.addEventListener('message', (event) => {
          const data = JSON.parse(event.data) as SymbolTickerTypes;
          updateTickerData(index, data).then(() => {
            resolve();
          });
        });
      });

    Promise.all(webSockets.map((webSocket, index) => attachWebSocketListeners(webSocket, index))).then(() => {
      // 모든 웹소켓 연결 완료
    });

    return () => {
      webSockets.forEach((webSocket) => {
        webSocket.close();
      });
    };
  }, []);

  return (
    <OuterBox>
      <TitleBox>
        <Title>Markets</Title>
        <Overview>
          <img src={chart} alt='chart' />
          <span>Market Overview</span>
        </Overview>
      </TitleBox>
      <TopListing tickers={tickers} newAndPopCoins={newAndPopCoins} priceColor={priceColor} />
      <CoinList tickers={tickers} priceColor={priceColor} />
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TitleBox = styled.div`
  display: flex;
  align-items: center;
  width: 1176px;
  justify-content: space-between;
  height: 40px;
  padding-top: 24px;
  background-color: ${(props) => props.theme.style.backgroundGrey};
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  margin-left: 60px;
`;
const Overview = styled.div`
  display: flex;
  align-items: center;
  margin-right: 60px;
  img {
    width: 20px;
  }

  span {
    font-size: 14px;
    font-weight: 600;
    margin-left: 8px;
  }
`;
