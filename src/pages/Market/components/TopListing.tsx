import React from 'react';
import styled from 'styled-components';
import coinIcon from '../images/mainIcon.png';

interface TopLists {
  id: number;
  name: string;
  nick: string;
  price: number;
  change: number;
  imgURL: string;
}

const TopList: TopLists[] = [
  { id: 1, name: 'BNB', nick: 'BNB', imgURL: 'www.naver.com', price: 272.8, change: 2.72 },
  { id: 2, name: 'BNB', nick: 'BNB', imgURL: 'www.naver.com', price: 272.8, change: 2.72 },
  { id: 3, name: 'BNB', nick: 'BNB', imgURL: 'www.naver.com', price: 272.8, change: 2.72 },
];

export default function TopListing() {
  return (
    <OuterBox>
      <ListingCard>
        <CardTitle>인기있는 화폐</CardTitle>
        <CoinBox>
          {TopList.map((el) => (
            <Coin key={el.id}>
              <img src={coinIcon} alt='coinIcon' />
              <CoinName>{el.name}</CoinName>
              <CoinPrice>{el.price}</CoinPrice>
              <CoinChange>{el.change}</CoinChange>
            </Coin>
          ))}
        </CoinBox>
      </ListingCard>
      <ListingCard>
        <CardTitle>새로운 화폐</CardTitle>
        <CoinBox>
          {TopList.map((el) => (
            <Coin>
              <img src={coinIcon} alt='coinIcon' />
              <CoinName>{el.name}</CoinName>
              <CoinPrice>{el.price}</CoinPrice>
              <CoinChange>{el.change}</CoinChange>
            </Coin>
          ))}
        </CoinBox>
      </ListingCard>
      <ListingCard>
        <CardTitle>가장 많이 오른 화폐</CardTitle>
        <CoinBox>
          {TopList.map((el) => (
            <Coin>
              <img src={coinIcon} alt='coinIcon' />
              <CoinName>{el.name}</CoinName>
              <CoinPrice>{el.price}</CoinPrice>
              <CoinChange>{el.change}</CoinChange>
            </Coin>
          ))}
        </CoinBox>
      </ListingCard>
      <ListingCard>
        <CardTitle>누적 거래량</CardTitle>
        <CoinBox>
          {TopList.map((el) => (
            <Coin>
              <img src={coinIcon} alt='coinIcon' />
              <CoinName>{el.name}</CoinName>
              <CoinPrice>{el.price}</CoinPrice>
              <CoinChange>{el.change}%</CoinChange>
            </Coin>
          ))}
        </CoinBox>
      </ListingCard>
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
  transition: background-color 0.4s ease-in-out;

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
  height: 24px;
  width: 100%;
  display: flex;
  margin: 0px -8px;
  padding: 6px 8px;
  align-items: center;
  img {
    width: 24px;
    margin-right: 8px;
  }
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.style.backgoundGrey};
  }
`;
const CoinName = styled.div`
  width: 74px;
  font-size: 14px;
  font-weight: 600;
`;
const CoinPrice = styled.div`
  font-size: 14px;
  width: 91.59px;
`;
const CoinChange = styled.div`
  width: 56.03;
  margin-left: 15px;
  font-size: 14px;
  font-weight: 600;
`;
