import React from 'react';
import styled from 'styled-components';
import { CoinTypes } from '@root/src/typing/types';
import { useNavigate } from 'react-router';
import CustomSpinner from './CustomSpinner';
import coinIcon from '../images/bitcoin.png';

type CoinProps = {
  coin: CoinTypes;
  priceColor: string;
};

function Coin({ coin, priceColor }: CoinProps) {
  const navigate = useNavigate();

  return (
    <OuterBox
      isMounted={coin.dayChange}
      onClick={() => {
        if (coin.dayChange) navigate('/detail', { state: { symbol: coin.symbol } });
      }}
    >
      {coin.dayChange ? (
        <CoinInnerBox>
          <img src={coin.imgURL} alt={coinIcon} />
          <CoinName>
            <Nick>{coin.nick}</Nick>
            <Name>{coin.name}</Name>
          </CoinName>
          <CoinPrice color={priceColor}>${coin.price}</CoinPrice>
          <CoinChange dayChange={coin.dayChange}>{coin.dayChange}%</CoinChange>
          <CoinVolume>${coin.volume}</CoinVolume>
          <CoinMaketCap>${coin.marketCap}</CoinMaketCap>
          <CoinTrade>거래하기</CoinTrade>
        </CoinInnerBox>
      ) : (
        <CustomSpinner />
      )}
    </OuterBox>
  );
}

const OuterBox = styled.div<{ isMounted: string | undefined }>`
  display: flex;
  height: 64px;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e9ecef;
  &:hover {
    cursor: ${(props) => (props.isMounted ? 'pointer' : 'normal')};
    background-color: ${(props) => (props.isMounted ? props.theme.style.backgroundGrey : 'none')};
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
const CoinChange = styled.div<{ dayChange: string | undefined }>`
  display: flex;
  justify-content: end;
  width: 200px;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => {
    if (Number(props.dayChange) === 0) return 'black';
    return Number(props.dayChange) > 0 ? props.theme.style.green : props.theme.style.red;
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

export default React.memo(Coin);
