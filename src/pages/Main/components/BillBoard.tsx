import React, { useEffect } from 'react';
import styled from 'styled-components';

export default function BillBoard() {
  return (
    <OuterBox>
      <BillBoardInnerBox>
        <Boards1>
          <BoardTitle>$760억</BoardTitle>
          <BoardDesc>24시간 거래량(비트코인 기준)</BoardDesc>
        </Boards1>
        <Boards>
          <BoardTitle>350+</BoardTitle>
          <BoardDesc>신규 가상화폐</BoardDesc>
        </Boards>
        <Boards>
          <BoardTitle>3 명</BoardTitle>
          <BoardDesc>가입한 회원</BoardDesc>
        </Boards>
        <Boards>
          <BoardTitle>0.10% 이하</BoardTitle>
          <BoardDesc>거래 수수료</BoardDesc>
        </Boards>
      </BillBoardInnerBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  height: 256px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.style.backgroundGrey};
`;

const BillBoardInnerBox = styled.div`
  display: flex;
  align-items: center;
`;
const Boards = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 20px;
  align-items: center;
  width: 250px;
`;

const Boards1 = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 20px;
  align-items: center;
  width: 250px;
  margin-left: 150px;
`;

const BoardTitle = styled.div`
  font-size: 40px;
  font-weight: bold;
`;
const BoardDesc = styled.div`
  margin-top: 10px;
  font-size: 16px;
`;
