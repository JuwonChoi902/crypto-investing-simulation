import React from 'react';
import styled from 'styled-components';
import coinImg from '../Images/mainIcon.png';

interface PopularCrypto {
  id: number;
  name: string;
  nick: string;
  imgURL: string;
  lastPrice: number;
  dayChange: number;
  marketCap: number;
}

const PopularCrypto: PopularCrypto[] = [
  {
    id: 1,
    name: 'BNB',
    nick: 'BNB',
    imgURL: 'www.naver.com',
    lastPrice: 259.9,
    dayChange: -7.57,
    marketCap: 41656,
  },
  {
    id: 2,
    name: 'Bitcoin',
    nick: 'BTC',
    imgURL: 'www.naver.com',
    lastPrice: 17177,
    dayChange: 1.45,
    marketCap: 330346,
  },
  {
    id: 3,
    name: 'Ethereum',
    nick: 'ETH',
    imgURL: 'www.naver.com',
    lastPrice: 1265,
    dayChange: 1.42,
    marketCap: 154983,
  },
  {
    id: 4,
    name: 'Galxe',
    nick: 'GAL',
    imgURL: 'www.naver.com',
    lastPrice: 1.33,
    dayChange: -1.34,
    marketCap: 47,
  },
  {
    id: 5,
    name: 'Green Metaverse Token',
    nick: 'GMT',
    imgURL: 'www.naver.com',
    lastPrice: 0.3867,
    dayChange: -2.28,
    marketCap: 232,
  },
];
export default function Popular() {
  return (
    <OuterBox>
      <TitleBox>
        <Title>인기 가상화폐</Title>
        <GoMarket>가상화폐 더 보러가기</GoMarket>
      </TitleBox>
      <ListBox>
        <CategoryBox>
          <Category>
            <Tap1>Name</Tap1>
            <Tap2>Last Price</Tap2>
            <Tap3>24시간 변동</Tap3>
            <Tap4>Market Cap</Tap4>
          </Category>
        </CategoryBox>
        <CryptoList>
          {PopularCrypto.map((el) => (
            <Crypto key={el.id}>
              <CryptoTap1>
                <img alt='coinImg' src={coinImg} />
                <CryptoName>{el.name}</CryptoName>
                <CryptoNick>{el.nick}</CryptoNick>
              </CryptoTap1>
              <CryptoTap2>${el.lastPrice}</CryptoTap2>
              <CryptoTap3 isPlusMinus={el.dayChange}>
                {el.dayChange >= 0 ? `+${el.dayChange}` : el.dayChange}%
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
  width: 363px;
`;
const CryptoTap2 = styled.div`
  width: 277px;
`;
const CryptoTap3 = styled.div<{ isPlusMinus: number }>`
  width: 308px;
  color: ${(props) => (props.isPlusMinus < 0 ? props.theme.style.red : props.theme.style.green)};
`;
const CryptoTap4 = styled.div`
  display: flex;
  justify-content: end;
  width: 161px;
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
