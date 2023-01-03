import React from 'react';
import styled from 'styled-components';

export default function BidAndBuy() {
  return (
    <OuterBox>
      <Categories>거래하기</Categories>
      <TradeFormBox>
        <LimitOrMarket>
          <OptionType>지정가</OptionType>
          <OptionType>시장가</OptionType>
        </LimitOrMarket>
        <InputOuterBox>
          <TradeInputBuy>
            <BalanceBox>
              <span>잔액</span>
              <Balance>9.00000000 BUSD</Balance>
            </BalanceBox>
            <Price>
              <InputTitle>가격</InputTitle>
              <UserInput />
              <InputUnit>BUSD</InputUnit>
            </Price>
            <Amount>
              <InputTitle>수량</InputTitle>
              <UserInput />
              <InputUnit>BTC</InputUnit>
            </Amount>
            <SlideBtn />
            <Total>
              <InputTitle>총액</InputTitle>
              <UserInput />
              <InputUnit>BUSD</InputUnit>
            </Total>
            <SubmitBtn type='submit' whatColor='Buy'>
              매수하기
            </SubmitBtn>
          </TradeInputBuy>
          <TradeInputSell>
            <BalanceBox>
              <span>잔액</span>
              <Balance>9.00000000 BUSD</Balance>
            </BalanceBox>
            <Price>
              <InputTitle>가격</InputTitle>
              <UserInput />
              <InputUnit>BUSD</InputUnit>
            </Price>
            <Amount>
              <InputTitle>수량</InputTitle>
              <UserInput />
              <InputUnit>BTC</InputUnit>
            </Amount>
            <SlideBtn />
            <Total>
              <InputTitle>총액</InputTitle>
              <UserInput />
              <InputUnit>BUSD</InputUnit>
            </Total>
            <SubmitBtn type='submit' whatColor='sell'>
              매도하기
            </SubmitBtn>
          </TradeInputSell>
        </InputOuterBox>
      </TradeFormBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 113%;
`;
const Categories = styled.div`
  ${(props) => props.theme.variables.flex()}
  height: 48px;
`;
const TradeFormBox = styled.div`
  padding: 16px;
`;
const LimitOrMarket = styled.div`
  display: flex;
  height: 30px;
`;
const OptionType = styled.div`
  ${(props) => props.theme.variables.flex()}
  font-size:14px;
  font-weight: 600;
  margin-right: 16px;

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const InputOuterBox = styled.div`
  display: flex;
  width: 100%;
`;
const TradeInputBuy = styled.form`
  padding-right: 32px;
  width: 100%;
`;
const TradeInputSell = styled.form`
  width: 100%;
`;
const BalanceBox = styled.div`
  font-size: 12px;
  display: flex;
  span {
    color: ${(props) => props.theme.style.grey};
    font-weight: 600;
    margin-right: 8px;
  }
  margin: 10px 0px 8px 0px;
`;
const Balance = styled.div``;
const Price = styled.div`
  background-color: #f0f1f2;
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 14px;
  justify-content: space-between;
  border-radius: 5px;
  margin-bottom: 12px;
  border: 1px solid #f0f1f2;

  &:hover {
    border: 1px solid ${(props) => props.theme.style.yellow};
  }
`;
const Amount = styled.div`
  background-color: #f0f1f2;
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 14px;
  justify-content: space-between;
  border-radius: 5px;
  margin-bottom: 12px;
  border: 1px solid #f0f1f2;

  &:hover {
    border: 1px solid ${(props) => props.theme.style.yellow};
  }
`;
const InputTitle = styled.div`
  margin-left: 8px;
  color: #848e9c;
  font-weight: 600;
`;
const UserInput = styled.input`
  background-color: #f0f1f2;
  border: none;
  text-align: right;

  &:focus {
    outline: none;
  }
`;
const InputUnit = styled.div`
  margin-right: 8px;
  font-weight: 400;
  margin-left: 8px;
`;
const SlideBtn = styled.div`
  height: 24px;
`;
const Total = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f1f2;
  height: 40px;
  font-size: 14px;
  justify-content: space-between;
  border-radius: 5px;
  margin-bottom: 12px;
  border: 1px solid #f0f1f2;

  &:hover {
    border: 1px solid ${(props) => props.theme.style.yellow};
  }
`;
const SubmitBtn = styled.button<{ whatColor: string }>`
  width: 100%;
  height: 40px;
  background-color: ${(props) =>
    props.whatColor === 'Buy' ? props.theme.style.green : props.theme.style.red};
  border-radius: 5px;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;
