import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type BillBoardProps = {
  volume: number | undefined;
};

export default function BillBoard({ volume }: BillBoardProps) {
  const [symbolLength, setSymbolLength] = useState<number | undefined>();

  useEffect(() => {
    const newSocket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    newSocket.addEventListener('message', (message) => {
      setSymbolLength(JSON.parse(message.data).length);
    });
  }, []);

  return (
    <OuterBox>
      <Boards1>
        <BoardTitle>
          $
          {volume?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          M
        </BoardTitle>
        <BoardDesc>24시간 거래량</BoardDesc>
      </Boards1>
      <Boards>
        <BoardTitle>{symbolLength ? `${symbolLength}+` : 0}</BoardTitle>
        <BoardDesc>거래중인 코인</BoardDesc>
      </Boards>
      <Boards>
        <BoardTitle>3 명</BoardTitle>
        <BoardDesc>가입한 회원</BoardDesc>
      </Boards>
      <Boards>
        <BoardTitle>0.10% 이하</BoardTitle>
        <BoardDesc>현재 거래 수수료</BoardDesc>
      </Boards>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  height: 256px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-right: 150px;
  background-color: ${(props) => props.theme.style.backgroundGrey};
`;

const Boards = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 20px;
  align-items: center;
  width: 100%;
`;

const Boards1 = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 20px;
  align-items: center;
  width: 100%;
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
