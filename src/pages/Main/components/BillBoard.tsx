import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { HeadersType } from '../../../typing/types';
import CustomSpinner from './CustomSpinner';

type BillBoardProps = {
  volume: number | undefined;
};

export default function BillBoard({ volume }: BillBoardProps) {
  const [symbolLength, setSymbolLength] = useState<number | undefined>();
  const [userCount, setUserCount] = useState<number>(0);
  const loginUserToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const newSocket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    newSocket.addEventListener('message', (message) => {
      setSymbolLength(JSON.parse(message.data).length);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const headers: HeadersType = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    if (loginUserToken) {
      headers.Authorization = `Bearer ${loginUserToken}`;
    } else {
      delete headers.Authorization;
    }

    fetch(`https://server.pien.kr:4000/user/count`, {
      headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isSuccess) {
          setUserCount(data.data.count);
        }
      });
  }, []);

  return (
    <OuterBox data-testid='billboard'>
      <Boards1>
        <BoardTitle>
          {volume ? (
            `${(Number(volume) / 100000).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}M`
          ) : (
            <CustomSpinner />
          )}
        </BoardTitle>
        <BoardDesc>24시간 거래량</BoardDesc>
      </Boards1>
      <Boards>
        <BoardTitle>{symbolLength ? `${symbolLength}+` : <CustomSpinner />}</BoardTitle>
        <BoardDesc>거래중인 코인</BoardDesc>
      </Boards>
      <Boards>
        <BoardTitle>{`${userCount} 명`}</BoardTitle>
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
  white-space: nowrap;
`;
const BoardDesc = styled.div`
  margin-top: 10px;
  font-size: 16px;
  white-space: nowrap;
`;
