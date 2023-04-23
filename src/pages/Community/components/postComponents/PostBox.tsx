import React from 'react';
import styled from 'styled-components';
import Post from './Post';
import Posts from './Posts';

type PostBoxProps = {
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
  setIsItSearching: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | undefined>>;
  isItSearching: boolean;
  boardNow: number | null;
  postNow: number | null;
};

export default function PostBox({
  setBoardNow,
  setPostNow,
  boardNow,
  postNow,
  setMenuNow,
  isItSearching,
  setIsItSearching,
  setProfileId,
}: PostBoxProps) {
  return (
    <OuterBox>
      {postNow ? (
        <Post
          setPostNow={setPostNow}
          setBoardNow={setBoardNow}
          setMenuNow={setMenuNow}
          setProfileId={setProfileId}
        />
      ) : (
        <Posts
          setBoardNow={setBoardNow}
          boardNow={boardNow}
          isItSearching={isItSearching}
          setIsItSearching={setIsItSearching}
          setProfileId={setProfileId}
          setMenuNow={setMenuNow}
        />
      )}
    </OuterBox>
  );
}

const OuterBox = styled.div``;
