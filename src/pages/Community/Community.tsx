import React from 'react';
import styled from 'styled-components';
import star from './images/star.png';
import Ranking from './components/Ranking';
import Posts from './components/Posts';

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
      </MainBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.style.backgroundGrey};
`;
const FilterBox = styled.div`
  width: 80%;
  display: flex;
  padding: 10px 20px;
  align-items: center;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
`;
const Favorite = styled.div`
  img {
    width: 16px;
  }

  &:hover {
    cursor: pointer;
  }
`;
const ShowAll = styled.div`
  padding-left: 16px;
  &:hover {
    cursor: pointer;
  }
`;
const MyPosting = styled.div`
  padding-left: 16px;
  &:hover {
    cursor: pointer;
  }
`;
const MainBox = styled.div`
  display: flex;
  width: 80%;
  margin-top: 16px;
`;
