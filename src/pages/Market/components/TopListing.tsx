import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import CustomSpinner from './CustomSpinner';
import coinIcon from '../images/mainIcon.png';
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
  const navigate = useNavigate();

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
              <Coin key={coin.id}>
                {coin.price ? (
                  <CoinInnerBox onClick={() => navigate('/detail', { state: { symbol: coin.symbol } })}>
                    <img src={coin.imgURL} alt={coinIcon} />
                    <CoinName>{coin.nick}</CoinName>
                    <CoinPrice thisColor={c[2][index]}>${coin.price}</CoinPrice>
                    <CoinChange isColor={coin.dayChange}>{coin.dayChange}</CoinChange>
                  </CoinInnerBox>
                ) : (
                  <CustomSpinner />
                )}
              </Coin>
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
const Coin = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CoinInnerBox = styled.div`
  height: 24px;
  width: 100%;
  display: flex;
  margin: 0px -8px;
  padding: 6px 8px;
  align-items: center;
  z-index: 3;
  img {
    width: 24px;
    margin-right: 8px;
  }

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.style.backgroundGrey};
  }
`;
const CoinName = styled.div`
  width: 74px;
  font-size: 14px;
  font-weight: 600;
`;
const CoinPrice = styled.div<{ thisColor: string }>`
  font-size: 14px;
  width: 91.59px;
  font-weight: bold;
  color: ${(props) => {
    if (props.thisColor === 'green') return props.theme.style.green;
    if (props.thisColor === 'red') return props.theme.style.red;
    return 'black';
  }};
`;
const CoinChange = styled.div<{ isColor: string | undefined }>`
  width: 56.03;
  margin-left: 15px;
  font-size: 14px;
  font-weight: 600;

  color: ${(props) => {
    if (Number(props.isColor) === 0) return 'black';
    return Number(props.isColor) > 0 ? props.theme.style.green : props.theme.style.red;
  }};
`;
