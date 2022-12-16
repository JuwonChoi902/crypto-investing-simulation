import React, { useEffect } from 'react';
import styled from 'styled-components';
import Overview from './components/Overview';
import CallBox from './components/CallBox';

export default function Detail() {
  useEffect(() => {
    fetch('http://3.34.183.121:3000/', {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  }, []);

  return (
    <OuterBox>
      <LeftBox>
        <TradeDetail>
          <Overview />
          <CallBox />
          <ChartBox>
            <Chart />
            <BidAndBuy />
          </ChartBox>
        </TradeDetail>
      </LeftBox>

      <RightBox />
    </OuterBox>
  );
}

const OuterBox = styled.div`
  border-top: 1px solid #edf0f2;
`;
const LeftBox = styled.div``;
const TradeDetail = styled.div``;
const ChartBox = styled.div``;
const Chart = styled.div``;
const BidAndBuy = styled.div``;
const RightBox = styled.div``;
