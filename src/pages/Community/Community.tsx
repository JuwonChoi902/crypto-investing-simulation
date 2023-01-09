import React from 'react';
import styled from 'styled-components';
import star from './images/star.png';
import Ranking from './components/Ranking';
import Posts from './components/Posts';
import Post from './components/Post';

export default function Community() {
  return (
    <OuterBox>
      <FilterBox>
        <Favorite>
          <img src={star} alt='star' />
        </Favorite>
        <ShowAll>모두 보기</ShowAll>
        <MyPosting>내가 쓴 글</MyPosting>
      </FilterBox>
      <MainBox>
        <Ranking />
        <Posts />
        {/* <Post /> */}
      </MainBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: ${(props) => props.theme.style.backgroundGrey}; */
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
const Favorite = styled.div`
  img {
    width: 16px;
  }

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowAll = styled.div`
  padding-left: 16px;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const MyPosting = styled.div`
  padding-left: 16px;
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
