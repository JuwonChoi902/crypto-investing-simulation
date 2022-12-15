import React from 'react';
import styled from 'styled-components';
import TopListing from './components/TopListing';
import CoinList from './components/CoinList';
import chart from './images/chart.png';

export default function Market() {
  return (
    <OuterBox>
      <TitleBox>
        <Title>Markets</Title>
        <Overview>
          <img src={chart} alt='chart' />
          <span>Market Overview</span>
        </Overview>
      </TitleBox>
      <TopListing />
      <CoinList />
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TitleBox = styled.div`
  display: flex;
  align-items: center;
  width: 1176px;
  justify-content: space-between;
  height: 40px;
  padding-top: 24px;
  background-color: ${(props) => props.theme.style.backgroundGrey};
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
`;
const Overview = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 20px;
  }

  span {
    font-size: 14px;
    font-weight: 600;
    margin-left: 8px;
  }
`;
