import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import board from '../../images/board.png';

const boardsNames: string[] = ['질문하기', '자랑하기', '공유하기', '잡담하기'];

type PostBoxProps = {
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  setIsItSearching: React.Dispatch<React.SetStateAction<boolean>>;
  boardNow: number | null;
};

export default function BoardsBox({ boardNow, setPostNow, setBoardNow, setIsItSearching }: PostBoxProps) {
  const navigate = useNavigate();
  return (
    <OuterBox>
      <ShowAll
        id={String(0)}
        boardNow={boardNow}
        onClick={() => {
          navigate('/community/list');
          setBoardNow(0);
          setPostNow(null);
          setIsItSearching(false);
        }}
      >
        전체글보기
      </ShowAll>
      <BoardsRest>
        {boardsNames.map((boardName, i) => (
          <Board
            key={boardName}
            id={String(i + 1)}
            boardNow={boardNow}
            onClick={() => {
              navigate('/community/list');
              setPostNow(null);
              setIsItSearching(false);
              setBoardNow(i + 1);
            }}
          >
            <img src={board} alt='board' />
            {boardName}
          </Board>
        ))}
      </BoardsRest>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  white-space: nowrap;
`;

const ShowAll = styled.div<{ id: string; boardNow: number | null }>`
  border-bottom: 2px solid #e5e5e5;
  padding: 13px 13px 11px 11px;
  font-weight: ${(props) => (props.boardNow === Number(props.id) ? 'bold' : 'normal')};
  font-size: 13px;

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const BoardsRest = styled.div`
  border-bottom: 2px solid #e5e5e5;
  font-size: 13px;
  padding: 13px 13px 11px 11px;

  img {
    width: 13px;
    margin-right: 5px;
  }
`;
const Board = styled.div<{ id: string; boardNow: number | null }>`
  display: flex;
  margin-bottom: ${(props) => (Number(props.id) === boardsNames.length ? 'none' : '10px')};
  font-weight: ${(props) => (Number(props.id) === props.boardNow ? 'bold' : 'normal')};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
