import React from 'react';
import styled from 'styled-components';

interface CallsData {
  id: number;
  price: number;
  amount: number;
  time: string;
}

const CallsDataUp: CallsData[] = [];
const CallsDataDown: CallsData[] = [];
for (let i = 1; i <= 17; i += 1) {
  CallsDataUp.push({
    id: i,
    price: 17021 + i,
    amount: i,
    time: '10:15:30',
  });

  CallsDataDown.push({
    id: i,
    price: 17021 - i,
    amount: i,
    time: '10:15:30',
  });
}

const price = 17020.01;

export default function MarketTrade() {
  return (
    <OuterBox>
      <TitleBox>
        <ShowMarketTrade>시장 체결</ShowMarketTrade>
        <ShowMyTrade>나의 체결</ShowMyTrade>
      </TitleBox>
      <CallTitle>
        <TitlePrice>가격(BUSD)</TitlePrice>
        <TitleAmount>수량(BTC)</TitleAmount>
        <TitleTotal>총액</TitleTotal>
      </CallTitle>
      <Calls>
        <HighCalls>
          {CallsDataUp.map((el) => (
            <Call>
              <CallPrice whatColor={el.price}>{el.price}</CallPrice>
              <CallAmount>{el.amount}</CallAmount>
              <CallTotal>{el.time}</CallTotal>
            </Call>
          ))}
        </HighCalls>
        <LowCalls>
          {CallsDataDown.map((el) => (
            <Call>
              <CallPrice whatColor={el.price}>{el.price}</CallPrice>
              <CallAmount>{el.amount}</CallAmount>
              <CallTotal>{el.time}</CallTotal>
            </Call>
          ))}
        </LowCalls>
      </Calls>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  padding: 0px 16px;
  padding-bottom: 8px;
  width: 100%;
  border-right: 1px solid #edf0f2;
`;
const TitleBox = styled.div`
  display: flex;
  padding: 16px 0px;
  font-size: 14px;
`;

const ShowMarketTrade = styled.div`
  color: ${(props) => props.theme.style.yellow};
  padding: 16px 1px 10px 1px;
  margin-right: 16px;

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowMyTrade = styled.div`
  color: #848e9c;
  padding: 16px 1px 10px 1px;
  margin-right: 85px;

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const CallTitle = styled.div`
  display: flex;
  font-size: 12px;
  height: 20px;
  color: ${(props) => props.theme.style.grey};
`;
const TitlePrice = styled.div`
  width: 100%;
`;
const TitleAmount = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;
const TitleTotal = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;
const Calls = styled.div``;
const HighCalls = styled.div``;
const Call = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  height: 20px;
`;
const CallPrice = styled.div<{ whatColor: number }>`
  color: ${(props) => (props.whatColor > price ? props.theme.style.red : props.theme.style.green)};
  width: 100%;
`;

const CallAmount = styled.div`
  display: flex;
  justify-content: end;
  color: #474d57;
  width: 100%;
`;
const CallTotal = styled.div`
  display: flex;
  justify-content: end;
  color: #474d57;
  width: 100%;
`;

const MarketPrice = styled.div`
  display: flex;
  align-items: center;
  height: 35px;

  div {
    font-size: 20px;
    color: ${(props) => props.theme.style.red};
    margin-right: 4px;
    font-weight: 600;
  }
  span {
    font-size: 12px;
    color: ${(props) => props.theme.style.grey};
  }
`;
const LowCalls = styled.div``;
