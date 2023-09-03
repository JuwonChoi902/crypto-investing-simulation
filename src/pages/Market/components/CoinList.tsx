import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Pages from './Pages';
import Coin from './Coin';
import star from '../images/star.png';
import search from '../images/searchCoin.png';
import upDown from '../images/upDown.png';
import { CoinTypes } from '../../../typing/types';

type CoinListProps = {
  tickers: CoinTypes[];
  priceColor: string[];
};

function CoinList({ tickers, priceColor }: CoinListProps) {
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<string>('2');
  const coinNumber = useMemo(() => 350, []);

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
            <Coin key={coin.id} coin={coin} priceColor={priceColor[index]} />
          ))}
        </Coins>
      </CoinListBox>
      <PageBox>
        <Pages page={page} postNumber={coinNumber} limit={10} setPage={setPage} />
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

const PageBox = styled.div`
  display: flex;
  justify-content: end;
  height: 28px;
  margin-top: 40px;
  padding-bottom: 24px;
`;

export default React.memo(CoinList);
