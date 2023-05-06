import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { SymbolTickerTypes, PopularCrypto } from '../../../typing/types';
import bitCoin from '../images/bitcoin.png';
import ethereum from '../images/ethereum.png';
import usdc from '../images/usd.png';
import tether from '../images/tether.png';
import bnb from '../images/bnb.png';

type PopularProps = {
  setVolume: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export default function Popular({ setVolume }: PopularProps) {
  const navigate = useNavigate();
  const [BTCticker, setBTCticker] = useState<SymbolTickerTypes | undefined>();
  const [ETHticker, setETHticker] = useState<SymbolTickerTypes | undefined>();
  const [USDTticker, setUSDTticker] = useState<SymbolTickerTypes | undefined>();
  const [BNBticker, setBNBticker] = useState<SymbolTickerTypes | undefined>();
  const [USDCticker, setUSDCticker] = useState<SymbolTickerTypes | undefined>();

  useEffect(() => {
    const BTCSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    const ETHSocket = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@ticker');
    const USDTSocket = new WebSocket('wss://stream.binance.com:9443/ws/busdusdt@ticker');
    const BNBSocket = new WebSocket('wss://stream.binance.com:9443/ws/bnbusdt@ticker');
    const USDCSocket = new WebSocket('wss://stream.binance.com:9443/ws/usdcusdt@ticker');

    BTCSocket.addEventListener('message', (message) => {
      setBTCticker(JSON.parse(message.data));
    });

    ETHSocket.addEventListener('message', (message) => {
      setETHticker(JSON.parse(message.data));
    });

    USDTSocket.addEventListener('message', (message) => {
      setUSDTticker(JSON.parse(message.data));
    });

    BNBSocket.addEventListener('message', (message) => {
      setBNBticker(JSON.parse(message.data));
    });

    USDCSocket.addEventListener('message', (message) => {
      setUSDCticker(JSON.parse(message.data));
    });
  }, []);

  const totalVolume =
    (Number(BTCticker?.q || 0) +
      Number(ETHticker?.q || 0) +
      Number(USDTticker?.q || 0) +
      Number(BNBticker?.q || 0) +
      Number(USDCticker?.q || 0)) /
    1000000;

  useEffect(() => {
    setVolume(totalVolume);
  }, [totalVolume]);

  const popularCrypto: PopularCrypto[] = [
    {
      id: 1,
      name: 'Bitcoin',
      nick: 'BTC',
      symbol: 'btcusdt',
      imgURL: bitCoin,
      lastPrice: Number(BTCticker?.c || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      dayChange: Number(BTCticker?.P || 0).toFixed(2),
      marketCap: (Number(BTCticker?.q || 0) / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      id: 2,
      name: 'Ethereum',
      nick: 'ETH',
      symbol: 'ethusdt',
      imgURL: ethereum,
      lastPrice: Number(ETHticker?.c || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      dayChange: Number(ETHticker?.P || 0).toFixed(2),
      marketCap: (Number(ETHticker?.q || 0) / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      id: 3,
      name: 'TetherUS',
      nick: 'USDT',
      symbol: 'busdusdt',
      imgURL: tether,
      lastPrice: Number(USDTticker?.c || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      dayChange: Number(USDTticker?.P || 0).toFixed(2),
      marketCap: (Number(USDTticker?.q || 0) / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      id: 4,
      name: 'BNB',
      nick: 'BNB',
      symbol: 'bnbusdt',
      imgURL: bnb,
      lastPrice: Number(BNBticker?.c || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      dayChange: Number(BNBticker?.P || 0).toFixed(2),
      marketCap: (Number(BNBticker?.q || 0) / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      id: 5,
      name: 'USD coin',
      nick: 'USDC',
      symbol: 'usdcusdt',
      imgURL: usdc,
      lastPrice: Number(USDCticker?.c || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      dayChange: Number(USDCticker?.P || 0).toFixed(2),
      marketCap: (Number(USDCticker?.q || 0) / 1000000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
  ];

  return (
    <OuterBox>
      <TitleBox>
        <Title>인기 가상화폐</Title>
        <GoMarket onClick={() => navigate('/market')}>가상화폐 더 보러가기</GoMarket>
      </TitleBox>
      <ListBox>
        <CategoryBox>
          <Category>
            <Tap1>Name</Tap1>
            <Tap2>가격</Tap2>
            <Tap3>24시간 변동</Tap3>
            <Tap4>24시간 거래량</Tap4>
          </Category>
        </CategoryBox>
        <CryptoList>
          {popularCrypto.map((el) => (
            <Crypto
              key={el.id}
              onClick={() => navigate('/detail', { state: { symbol: el.symbol, img: el.imgURL } })}
            >
              <CryptoTap1>
                <img alt='coinImg' src={el.imgURL} />
                <CryptoName>{el.name}</CryptoName>
                <CryptoNick>{el.nick}</CryptoNick>
              </CryptoTap1>
              <CryptoTap2>${el.lastPrice || 0}</CryptoTap2>
              <CryptoTap3 isPlusMinus={Number(el.dayChange)}>
                {Number(el.dayChange) > 0 ? `+${el.dayChange}` : el.dayChange}%
              </CryptoTap3>
              <CryptoTap4>${el.marketCap.toLocaleString()}M</CryptoTap4>
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
const CryptoTap2 = styled.div`
  width: 100%;
  margin-right: 50px;
`;
const CryptoTap3 = styled.div<{ isPlusMinus: number }>`
  width: 100%;
  margin-left: 0px;
  color: ${(props) => {
    if (props.isPlusMinus === 0) {
      return 'black';
    }
    return props.isPlusMinus < 0 ? props.theme.style.red : props.theme.style.green;
  }};
`;
const CryptoTap4 = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
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
