import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { CoinTypes } from '@root/src/typing/types';
import CustomSpinner from './CustomSpinner';
import coinIcon from '../images/bitcoin.png';

type ListingCoinProps = {
  coin: CoinTypes;
  priceColor: string;
};

function ListingCoin({ coin, priceColor }: ListingCoinProps) {
  const navigate = useNavigate();

  return (
    <OuterBox>
      {coin.price ? (
        <CoinInnerBox onClick={() => navigate('/detail', { state: { symbol: coin.symbol } })}>
          <img src={coin.imgURL} alt={coinIcon} />
          <CoinName>{coin.nick}</CoinName>
          <CoinPrice thisColor={priceColor}>${coin.price}</CoinPrice>
          <CoinChange isColor={coin.dayChange}>{coin.dayChange}</CoinChange>
        </CoinInnerBox>
      ) : (
        <CustomSpinner />
      )}
    </OuterBox>
  );
}

const OuterBox = styled.div`
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

export default React.memo(ListingCoin);
