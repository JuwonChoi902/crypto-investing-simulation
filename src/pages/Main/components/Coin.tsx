import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { CoinTypes } from '../../../typing/types';
import CustomSpinner from './CustomSpinner';
import coinImg from '../images/coinImg.png';

type CoinProps = {
  coin: CoinTypes;
  priceColor: string;
};

function Coin({ coin, priceColor }: CoinProps) {
  const navigate = useNavigate();
  return (
    <OuterBox onClick={() => navigate('/detail', { state: { symbol: coin.symbol } })}>
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
      <CryptoTap2 thisColor={priceColor}>
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
    </OuterBox>
  );
}

const OuterBox = styled.div`
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

export default React.memo(Coin);
