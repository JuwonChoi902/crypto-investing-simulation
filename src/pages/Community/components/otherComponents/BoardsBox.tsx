import React from 'react';
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
  return (
    <OuterBox>
      <ShowAll
        id={0}
        boardNow={boardNow}
        onClick={() => {
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
            id={i + 1}
            boardNow={boardNow}
            onClick={() => {
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

const OuterBox = styled.div``;

const ShowAll = styled.div<{ id: any; boardNow: number | null }>`
  border-bottom: 2px solid #e5e5e5;
  padding: 13px 13px 11px 11px;
  font-weight: ${(props) => (props.boardNow === props.id ? 'bold' : 'normal')};
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
const Board = styled.div<{ id: any; boardNow: number | null }>`
  display: flex;
  margin-bottom: ${(props) => (props.id === boardsNames.length ? 'none' : '10px')};
  font-weight: ${(props) => (props.boardNow === props.id ? 'bold' : 'normal')};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
