import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { SymbolTickerTypes, CoinTypes } from '../../../typing/types';
import { unitParsing } from '../../../utils/functions';
import bitCoin from '../images/bitcoin.png';
import ethereum from '../images/ethereum.png';
import usdc from '../images/usd.png';
import tether from '../images/tether.png';
import bnb from '../images/bnb.png';
import coinImg from '../images/coinImg.png';
import CustomSpinner from './CustomSpinner';

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

export default function Popular({ setVolume }: PopularProps) {
  const [tickers, setTickers] = useState<CoinTypes[]>(tenDummyCoins);
  const [priceColor, setPriceColor] = useState<string[]>(Array.from({ length: tickers.length }));
  const navigate = useNavigate();
  const priceRef = useRef<number[]>([]);

  const memoizedUnitParsing = useCallback(unitParsing, []);

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
            price: memoizedUnitParsing(data.c),
            dayChange: Number(data.P) > 0 ? `+${Number(data.P).toFixed(2)}` : `${Number(data.P).toFixed(2)}`,
            volume: memoizedUnitParsing(data.q),
            volumeOrigin: data.q,
            marketCap: memoizedUnitParsing(String(Number(data.c) * updatedTickers[index].quantity)),
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

  const totalVoume = tickers.reduce((prev, cur) => prev + Number(cur.volumeOrigin), 0);

  useEffect(() => {
    setVolume(totalVoume);
  }, [totalVoume]);

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
            <Crypto key={coin.id} onClick={() => navigate('/detail', { state: { symbol: coin.symbol } })}>
              <CryptoTap1>
                {coin.dayChange ? (
                  <>
                    <img src={coin.imgURL} alt={coinImg} />
                    <CryptoName>{coin.name}</CryptoName>
                    <CryptoNick>{coin.nick}</CryptoNick>
                  </>
                ) : (
                  <CryptoTap1Spinner>
                    <CustomSpinner />
                  </CryptoTap1Spinner>
                )}
              </CryptoTap1>
              <CryptoTap2 thisColor={priceColor[index]}>
                {coin.price ? (
                  `$${coin.price}`
                ) : (
                  <CryptoTap2Spinner>
                    <CustomSpinner />
                  </CryptoTap2Spinner>
                )}
              </CryptoTap2>
              <CryptoTap3 dayChange={coin.dayChange}>
                {coin.dayChange ? (
                  `${coin.dayChange}%`
                ) : (
                  <CryptoTap3Spinner>
                    <CustomSpinner />
                  </CryptoTap3Spinner>
                )}
              </CryptoTap3>
              <CryptoTap4>
                {coin.dayChange ? (
                  `$${coin.volume}`
                ) : (
                  <CryptoTap4Spinner>
                    <CustomSpinner />
                  </CryptoTap4Spinner>
                )}
              </CryptoTap4>
            </Crypto>
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
const Crypto = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  height: 32px;
  padding: 16px;

  img {
    width: 32px;
    height: 32px;
    margin-right: 16px;
  }

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
`;

const CryptoTap1 = styled.div`
  display: flex;
  align-items: center;
  margin-right: 130px;
  width: 100%;
`;
const CryptoTap1Spinner = styled.div`
  margin-left: 50px;
`;

const CryptoTap2 = styled.div<{ thisColor: string }>`
  width: 100%;
  margin-right: 50px;
  font-weight: bold;
  color: ${(props) => {
    if (props.thisColor === 'green') return props.theme.style.green;
    if (props.thisColor === 'red') return props.theme.style.red;
    return 'black';
  }};
`;

const CryptoTap2Spinner = styled.div`
  margin-left: 30px;
`;

const CryptoTap3 = styled.div<{ dayChange: string | undefined }>`
  width: 100%;
  margin-left: 0px;
  font-weight: bold;
  color: ${(props) => {
    if (Number(props.dayChange) === 0) {
      return 'black';
    }
    return Number(props.dayChange) < 0 ? props.theme.style.red : props.theme.style.green;
  }};
`;

const CryptoTap3Spinner = styled.div`
  margin-left: 30px;
`;

const CryptoTap4 = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  font-weight: bold;
`;

const CryptoTap4Spinner = styled.div`
  display: flex;
  justify-content: end;
`;

const CryptoName = styled.div`
  display: flex;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;
const CryptoNick = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.style.grey};
`;
