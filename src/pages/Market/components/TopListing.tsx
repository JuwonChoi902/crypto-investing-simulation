import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import CustomSpinner from './CustomSpinner';
import coinIcon from '../images/mainIcon.png';
import { CoinTypes, SymbolTickerTypes } from '../../../typing/types';

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
    const webSockets: WebSocket[] = newAndPopCoins.map(
      (coin) => new WebSocket(`wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`),
    );

    const updateTickerData = (index: number, data: SymbolTickerTypes) =>
      new Promise<Array<CoinTypes | undefined>>((resolve) => {
        setRestTickers((prevTickers) => {
          const updatedTickers = [...prevTickers];
          const prevPrice = priceRef.current[index];
          const currentPrice = Number(data.c);

          if (prevPrice !== undefined) {
            if (currentPrice > prevPrice) {
              setRestPriceColor((prevColors) => {
                const colors = [...prevColors];
                colors[index] = 'green';
                return colors;
              });
            } else if (currentPrice < prevPrice) {
              setRestPriceColor((prevColors) => {
                const colors = [...prevColors];
                colors[index] = 'red';
                return colors;
              });
            } else {
              setRestPriceColor((prevColors) => {
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
