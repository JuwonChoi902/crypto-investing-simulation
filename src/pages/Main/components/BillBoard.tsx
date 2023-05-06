import React from 'react';
import styled from 'styled-components';

export default function BillBoard() {
  return (
    <OuterBox>
      <BillBoardInnerBox>
        <Boards>
          <BoardTitle>$760억</BoardTitle>
          <BoardDesc>24시간 거래량</BoardDesc>
        </Boards>
        <Boards>
          <BoardTitle>350+</BoardTitle>
          <BoardDesc>신규 가상화폐</BoardDesc>
        </Boards>
        <Boards>
          <BoardTitle>1억 2천만</BoardTitle>
          <BoardDesc>등록된 회원</BoardDesc>
        </Boards>
        <Boards>
          <BoardTitle>0.10% 이하</BoardTitle>
          <BoardDesc>최저 수수료</BoardDesc>
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
const BoardTitle = styled.div`
  font-size: 40px;
  font-weight: bold;
`;
const BoardDesc = styled.div`
  margin-top: 10px;
  font-size: 16px;
`;
