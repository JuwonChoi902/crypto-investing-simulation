import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TopListing from './components/TopListing';
import CoinList from './components/CoinList';
import { CoinTypes, SymbolTickerTypes } from '../../typing/types';
import { updateTickerData } from '../../utils/functions';
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

  useEffect(() => {
    const webSockets: WebSocket[] = tenDummyCoins.map(
      (coin) => new WebSocket(`wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`),
    );

    const attachWebSocketListeners = (webSocket: WebSocket, index: number) =>
      webSocket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data) as SymbolTickerTypes;
        updateTickerData(index, data, setTickers, setPriceColor, priceRef);
      });

    webSockets.map((webSocket, index) => attachWebSocketListeners(webSocket, index));

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
