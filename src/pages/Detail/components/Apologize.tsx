import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

export default function Apologize() {
  const navigate = useNavigate();

  return (
    <OuterBox>
      <BlockBox />
      <MessageBox>
        <Header>서비스 일시중지 안내</Header>
        <Main>
          <div>현재 Binance의 Market 데이터 API Key 에 문제가 있어 점검중입니다.</div>
          <div>빠른시일내에 서비스 가능하도록 하겠습니다. 불편을드려 대단히 죄송합니다.</div>
        </Main>
        <Tail>
          <div>현재 커뮤니티 서비스가 이용가능하오니,</div>
          <div>
            커뮤니티 페이지를 통해서 적극적인 피드백 부탁드립니다.<span>-ByCripto</span>
          </div>
        </Tail>
        <ButtonBox>
          <ConfirmBtn type='button' onClick={() => navigate('/community')}>
            확인
          </ConfirmBtn>
        </ButtonBox>
      </MessageBox>
    </OuterBox>
  );
}

const OuterBox = styled.div``;

const BlockBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  z-index: 20;
  opacity: 0.2;
`;

const MessageBox = styled.div`
  width: 700px;
  height: 350px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  background-color: white;
  z-index: 21;
`;

const Header = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
`;
const Main = styled.div`
  padding: 0px 50px 20px 50px;

  div {
    margin-bottom: 20px;
  }
`;

const Tail = styled.div`
  padding: 0px 50px 20px 50px;

  div {
    margin-bottom: 20px;
  }
  span {
    margin-left: 50px;
  }
`;
const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConfirmBtn = styled.button`
  width: 50px;
  height: 30px;

  &:hover {
    cursor: pointer;
  }
`;
