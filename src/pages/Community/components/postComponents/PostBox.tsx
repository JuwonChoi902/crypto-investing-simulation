import React from 'react';
import styled from 'styled-components';
import Post from './Post';
import Posts from './Posts';

type PostBoxProps = {
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  boardNow: number | null;
  postNow: number | null;
};

export default function PostBox2({ setBoardNow, setPostNow, boardNow, postNow }: PostBoxProps) {
  return (
    <OuterBox>
      {postNow ? (
        <Post setPostNow={setPostNow} setBoardNow={setBoardNow} />
      ) : (
        <Posts setBoardNow={setBoardNow} boardNow={boardNow} />
      )}
    </OuterBox>
  );
}

const OuterBox = styled.div``;
