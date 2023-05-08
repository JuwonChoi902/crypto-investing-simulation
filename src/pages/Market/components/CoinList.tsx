import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Pages from './Pages';
import CustomSpinner from './CustomSpinner';
import star from '../images/star.png';
import search from '../images/searchCoin.png';
import coinIcon from '../images/mainIcon.png';
import upDown from '../images/upDown.png';
import { CoinTypes } from '../../../typing/types';

type CoinListProps = {
  tickers: CoinTypes[];
  priceColor: string[];
};

export default function CoinList({ tickers, priceColor }: CoinListProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<string>('2');
  const coinNumber = 350;

  return (
    <OuterBox>
      <CategoryBox>
        <CategoryName id='1' category={category} onClick={() => alert('서비스 준비중입니다.')}>
          <img src={star} alt='star' />
          즐겨찾기
        </CategoryName>
        <CategoryName id='2' category={category} onClick={() => setCategory('2')}>
          전체
        </CategoryName>
        <SearchBox>
          <img src={search} alt='search' />
          <SearchTap
            placeholder='화폐 이름을 검색하세요'
            onClick={() => alert('검색서비스는 현재 점검중입니다.')}
          />
        </SearchBox>
      </CategoryBox>
      <CoinListBox>
        <FilterTap>
          <FilterName>
            <div>이름</div>
            <img src={upDown} alt='updown' />
          </FilterName>
          <FilterPrice>
            <div>가격(달러)</div>
            <img src={upDown} alt='updown' />
          </FilterPrice>
          <FilterChange>
            <div>24시간 변동</div>
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
          {tickers.slice(0, 10).map((coin, index) => (
            <Coin key={coin.id}>
              {coin.dayChange ? (
                <CoinInnerBox>
                  <img src={coin.imgURL} alt={coinIcon} />
                  <CoinName>
                    <Nick>{coin.nick}</Nick>
                    <Name>{coin.name}</Name>
                  </CoinName>

                  <CoinPrice color={priceColor[index]}>${coin.price}</CoinPrice>
                  <CoinChange isColor={coin.dayChange}>{coin.dayChange}</CoinChange>
                  <CoinVolume>${coin.volume}</CoinVolume>
                  <CoinMaketCap>${coin.marketCap}</CoinMaketCap>
                  <CoinTrade onClick={() => navigate('/detail', { state: { symbol: coin.symbol } })}>
                    거래하기
                  </CoinTrade>
                </CoinInnerBox>
              ) : (
                <CustomSpinner />
              )}
            </Coin>
          ))}
        </Coins>
      </CoinListBox>
      <PageBox>
        <Pages page={page} postNumber={coinNumber} limit={10} />
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
const CategoryName = styled.div<{ category: string }>`
  display: flex;
  align-items: center;
  ${(props) => props.theme.variables.flex()}
  width:116px;
  height: 44px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.style.grey};
  background-color: ${(props) => (props.id === props.category ? '#feeaa3' : 'none')};

  img {
    width: 16px;
    margin-right: 5px;
  }

  &:hover {
    cursor: pointer;
    background-color: ${(props) =>
      props.id === props.category ? props.theme.style.buttonYellow : ' #fafafa;'};
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
  justify-content: center;
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

const CoinInnerBox = styled.div`
  display: flex;
  align-items: center;
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
const CoinPrice = styled.div<{ color: string | undefined }>`
  width: 118px;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => {
    if (props.color === 'green') return props.theme.style.green;
    if (props.color === 'red') return props.theme.style.red;
    return 'black';
  }};
`;
const CoinChange = styled.div<{ isColor: string | undefined }>`
  display: flex;
  justify-content: end;
  width: 200px;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => {
    if (Number(props.isColor) === 0) return 'black';
    return Number(props.isColor) > 0 ? props.theme.style.green : props.theme.style.red;
  }};
`;
const CoinVolume = styled.div`
  display: flex;
  justify-content: end;
  width: 154px;
  font-size: 16px;
  font-weight: bold;
`;
const CoinMaketCap = styled.div`
  display: flex;
  justify-content: end;
  width: 154px;
  font-size: 16px;
  font-weight: bold;
`;
const CoinTrade = styled.div`
  display: flex;
  justify-content: end;
  font-size: 16px;
  color: #c99402;
  width: 196px;
  margin-right: 65px;
`;
const PageBox = styled.div`
  display: flex;
  justify-content: end;
  height: 28px;
  margin-top: 40px;
  padding-bottom: 24px;
`;
