import React, { PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import star from '../images/star.png';
import search from '../images/searchCoin.png';
import coinIcon from '../images/mainIcon.png';
import pageLeft from '../images/pageLeft.png';
import pageRight from '../images/pageRight.png';
import upDown from '../images/upDown.png';
import upDownDown from '../images/upDownDown.png';
import upDownUp from '../images/upDownUp.png';

interface Coin {
  id: number;
  name: string;
  nick: string;
  imgURL: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
}

const CoinData: Coin[] = [
  {
    id: 1,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: 0.1,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
  {
    id: 2,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: -0.6,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
  {
    id: 3,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: 0.5,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
  {
    id: 4,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: 0.1,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
  {
    id: 5,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: 0.1,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
  {
    id: 6,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: 0.1,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
  {
    id: 7,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: 0.1,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
  {
    id: 8,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: 0,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
  {
    id: 9,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: 0.1,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
  {
    id: 10,
    name: 'TetherUS',
    nick: 'USDT',
    price: 0.9985,
    change: 0.1,
    marketCap: 65879.56,
    imgURL: 'www.naver.com',
    volume: 32156.03,
  },
];

export default function CoinList() {
  const [tickers, setTickers] = useState();
  const navigate = useNavigate();

  const newSocket = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

  newSocket.addEventListener('message', (message) => {
    setTickers(JSON.parse(message.data));
  });

  return (
    <OuterBox>
      <CategoryBox>
        <CategoryName>
          <img src={star} alt='star' />
          즐겨찾기
        </CategoryName>
        <CategoryName>전체</CategoryName>
        <SearchBox>
          <img src={search} alt='search' />
          <SearchTap placeholder='화폐 이름을 검색하세요' />
        </SearchBox>
      </CategoryBox>
      <CoinListBox>
        <FilterTap>
          <FilterName>
            <div>이름</div>
            <img src={upDown} alt='updown' />
          </FilterName>
          <FilterPrice>
            <div>가격</div>
            <img src={upDown} alt='updown' />
          </FilterPrice>
          <FilterChange>
            <div>1h</div>
            <img src={upDown} alt='updown' />
          </FilterChange>
          <FilterVolume>
            <div>24시간 거래량</div>
            <img src={upDown} alt='updown' />
          </FilterVolume>
          <FilterMarketCap>
            <div>시가총액</div>
            <img src={upDown} alt='updown' />
          </FilterMarketCap>
        </FilterTap>
        <Coins>
          {CoinData.map((el) => (
            <Coin key={el.id}>
              <img src={coinIcon} alt='coinIcon' />
              <CoinName>
                <Nick>{el.nick}</Nick>
                <Name>{el.name}</Name>
              </CoinName>

              <CoinPrice>${el.price}</CoinPrice>
              <CoinChange isColor={el.change}>{el.change > 0 ? `+${el.change}` : el.change}%</CoinChange>
              <CoinVolume>{el.volume}M</CoinVolume>
              <CoinMaketCap>${el.marketCap}M</CoinMaketCap>
              <CoinTrade onClick={() => navigate('/detail')}>거래하기</CoinTrade>
            </Coin>
          ))}
        </Coins>
      </CoinListBox>
      <PageBox>
        <Pages>
          <img src={pageLeft} alt='pageLeft' />
          <Page>1</Page>
          <Page>2</Page>
          <Page>3</Page>
          <Page>4</Page>
          <Page>5</Page>
          <img src={pageRight} alt='pageRight' />
        </Pages>
      </PageBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 1176px;
`;
const CategoryBox = styled.div`
  display: flex;
  height: 44px;
  position: relative;
  margin: 24px 0 16px 0;
`;
const CategoryName = styled.div`
  display: flex;
  align-items: center;
  ${(props) => props.theme.variables.flex()}
  width:116px;
  height: 44px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.style.grey};

  img {
    width: 16px;
    margin-right: 5px;
  }

  &:hover {
    cursor: pointer;
    background-color: #fafafa;
  }
`;

const SearchBox = styled.div`
  position: absolute;
  right: 0;
  width: 282px;
  height: 44px;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  display: flex;
  align-items: center;

  &:hover {
    border: 1px solid #efb90a;
  }

  img {
    width: 24px;
    margin: 5px;
  }
`;

const SearchTap = styled.input`
  width: 242px;
  border: none;

  ::placeholder {
    color: #b7bdc6;
    margin-left: 20px;
  }

  &:focus {
    outline: none;
  }
`;

const CoinListBox = styled.div``;

const FilterTap = styled.div`
  display: flex;
  height: 16px;
  padding: 12px 16px;
  background-color: ${(props) => props.theme.style.backgroundGrey};

  img {
    width: 13px;
    height: 13px;
  }
`;

const FilterName = styled.div`
  display: flex;
  font-size: 12px;
  width: 261px;
`;
const FilterPrice = styled.div`
  display: flex;
  width: 118px;
  font-size: 12px;
`;
const FilterChange = styled.div`
  display: flex;
  justify-content: end;
  width: 200px;
  font-size: 12px;
`;
const FilterVolume = styled.div`
  display: flex;
  justify-content: end;
  width: 154px;
  font-size: 12px;
`;
const FilterMarketCap = styled.div`
  display: flex;
  justify-content: end;
  width: 154px;
  font-size: 12px;
`;

const Coins = styled.div``;
const Coin = styled.div`
  display: flex;
  height: 64px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid #e9ecef;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.style.backgroundGrey};
  }

  img {
    width: 32px;
    height: 32px;
    margin-right: 16px;
  }
`;
const CoinName = styled.div`
  display: flex;
  align-items: center;
  width: 213px;
`;

const Nick = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
`;
const Name = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.style.grey};
`;
const CoinPrice = styled.div`
  width: 118px;
  font-size: 16px;
  font-weight: 600;
`;
const CoinChange = styled.div<{ isColor: number }>`
  display: flex;
  justify-content: end;
  width: 200px;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.isColor > 0 ? props.theme.style.green : props.theme.style.red)};
  color: ${(props) => (props.isColor === 0 ? 'black' : 'none')};
`;
const CoinVolume = styled.div`
  display: flex;
  justify-content: end;
  width: 154px;
  font-size: 16px;
`;
const CoinMaketCap = styled.div`
  display: flex;
  justify-content: end;
  width: 154px;
  font-size: 16px;
`;
const CoinTrade = styled.div`
  display: flex;
  justify-content: end;
  font-size: 16px;
  color: #c99402;
  width: 196px;
`;
const PageBox = styled.div`
  display: flex;
  justify-content: end;
  height: 28px;
  margin-top: 40px;
  padding-bottom: 24px;
`;

const Pages = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;

  img {
    width: 7.5px;
    height: 11px;
    margin: 14px;

    &:hover {
      cursor: pointer;
    }
  }
`;

const Page = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 28px;
  height: 28px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  margin: 6px;

  &:hover {
    cursor: pointer;
  }
`;
