import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import star from './images/star.png';
import Ranking from './components/Ranking';
import Posts from './components/Posts';
import Post from './components/Post';

export default function Community() {
  const [postNow, setPostNow] = useState<number | null>(null);
  const [boardNow, setBoardNow] = useState<number>(2);

  const params = useParams();

  useEffect(() => {
    if (params.id === 'list') {
      setPostNow(null);
    } else {
      setPostNow(Number(params.id));
    }
  }, [params.id]);

  return (
    <OuterBox>
      <FilterBox>
        <Favorite id={1} boardNow={boardNow} onClick={() => setBoardNow(1)}>
          <img src={star} alt='star' />
        </Favorite>
        <ShowPosts id={2} boardNow={boardNow} onClick={() => setBoardNow(2)}>
          게시글 보기
        </ShowPosts>
        <MyPosting id={3} boardNow={boardNow} onClick={() => setBoardNow(3)}>
          마이페이지
        </MyPosting>
      </FilterBox>
      <MainBox>
        <MainLeft>
          <Ranking />
          <BoardsBox>
            <ShowAll />
            <BoardsRest />
          </BoardsBox>
        </MainLeft>
        {postNow ? <Post setPostNow={setPostNow} /> : <Posts />}
      </MainBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  margin-top: 100px;
`;
const FilterBox = styled.div`
  width: 1040px;
  display: flex;
  padding: 10px 20px;
  align-items: center;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  margin-bottom: 50px;
`;
const Favorite = styled.div<{ id: any; boardNow: number }>`
  img {
    width: 16px;
  }

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowPosts = styled.div<{ id: any; boardNow: number }>`
  padding-left: 16px;
  color: ${(props) => (props.id === props.boardNow ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const MyPosting = styled.div<{ id: any; boardNow: number }>`
  padding-left: 16px;
  color: ${(props) => (props.id === props.boardNow ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const MainBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1080px;
  margin-top: 16px;
`;

const MainLeft = styled.div``;
const BoardsBox = styled.div``;
const ShowAll = styled.div``;
const BoardsRest = styled.div``;
