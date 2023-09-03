import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ListingCoin from './ListingCoin';
import { CoinTypes, SymbolTickerTypes } from '../../../typing/types';
import { updateTickerData } from '../../../utils/functions';

type TopListingProps = {
  tickers: CoinTypes[];
  newAndPopCoins: CoinTypes[];
  priceColor: string[];
};

export default function TopListing({ tickers, newAndPopCoins, priceColor }: TopListingProps) {
  const [restTickers, setRestTickers] = useState<CoinTypes[]>(newAndPopCoins);
  const [restPriceColor, setRestPriceColor] = useState<string[]>(
    Array.from({ length: newAndPopCoins.length }),
  );
  const priceRef = useRef<number[]>([]);

  useEffect(() => {
    const webSockets: WebSocket[] = newAndPopCoins.map(
      (coin) => new WebSocket(`wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`),
    );

    const attachWebSocketListeners = (webSocket: WebSocket, index: number) => {
      webSocket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data) as SymbolTickerTypes;
        updateTickerData(index, data, setRestTickers, setRestPriceColor, priceRef);
      });
    };

    webSockets.map((webSocket, index) => attachWebSocketListeners(webSocket, index));

    return () => {
      webSockets.forEach((webSocket) => {
        webSocket.close();
      });
    };
  }, []);

  const [topThree, topThreeColor]: [CoinTypes[], string[]] = [tickers.slice(0, 3), priceColor.slice(0, 3)];
  const [newList, newListColor]: [CoinTypes[], string[]] = [
    restTickers.slice(0, 3),
    restPriceColor.slice(0, 3),
  ];
  const [popularList, popularListColor]: [CoinTypes[], string[]] = [
    restTickers.slice(3),
    restPriceColor.slice(3),
  ];
  const [volumeList, volumeListColor]: [CoinTypes[], string[]] = [
    [tickers[3], ...tickers.slice(0, 2)],
    [priceColor[3], ...priceColor.slice(0, 2)],
  ];

  const list: [string, CoinTypes[], string[]][] = [
    ['Top 3', topThree, topThreeColor],
    ['새로운 화폐', newList, newListColor],
    ['인기 화폐', popularList, popularListColor],
    ['누적 거래량', volumeList, volumeListColor],
  ];

  return (
    <OuterBox>
      {list.map((c) => (
        <ListingCard key={c[0]}>
          <CardTitle>{c[0]}</CardTitle>
          <CoinBox>
            {c[1].map((coin, index) => (
              <ListingCoin key={coin.id} coin={coin} priceColor={c[2][index]} />
            ))}
          </CoinBox>
        </ListingCard>
      ))}
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  padding: 24px;
  background-color: ${(props) => props.theme.style.backgroundGrey};
`;
const ListingCard = styled.div`
  width: 250px;
  height: 148px;
  padding: 16px;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: white;
  }
`;
const CardTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.style.grey};
  width: 100%;
  font-size: 12px;
  height: 32px;
  padding: 4px 8px;
  font-weight: 600;
`;
const CoinBox = styled.div``;
