import React, { useState } from 'react';
import styled from 'styled-components';
import HeaderBox from './HeaderBox';
import PostHistory from './PostHistory';
import CommentHistory from './CommentHistory';
import CommentedPost from './CommentedPost';
import LikeHistory from './LikeHistory';
import IncomeInfo from './IncomeInfo';

export default function UserInfo() {
  const [category, setCategory] = useState<number>(0);

  const categories = ['작성글', '작성댓글', '댓글단 글', '좋아요한 글', '수익률'];

  return (
    <OuterBox>
      <HeaderBox />
      <Main>
        <CategoryBox>
          <CategoryLeft>
            {categories.map((c, i) => (
              <Category id={i} category={category} onClick={() => setCategory(i)}>
                {c}
              </Category>
            ))}
          </CategoryLeft>
          <CategoryRight>
            <Category id={5} category={category} onClick={() => setCategory(5)}>
              삭제한 게시글
            </Category>
          </CategoryRight>
        </CategoryBox>
        <ListBox>
          {category === 0 ? <PostHistory /> : null}
          {category === 1 ? <CommentHistory /> : null}
          {category === 2 ? <CommentedPost /> : null}
          {category === 3 ? <LikeHistory /> : null}
          {category === 4 ? <IncomeInfo /> : null}
        </ListBox>
      </Main>
    </OuterBox>
  );
}

const OuterBox = styled.div``;
const Main = styled.div``;
const CategoryBox = styled.div`
  padding: 29px 0 18px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 860px;
  font-size: 13px;
`;
const CategoryLeft = styled.div`
  display: flex;
`;
const CategoryRight = styled.div``;
const Category = styled.div<{ id: any; category: number }>`
  margin-right: 16px;
  padding-bottom: 5px;
  border-bottom: ${(props) =>
    props.category === props.id ? `2px solid ${props.theme.style.yellow}` : 'none'};
  font-weight: ${(props) => (props.category === props.id ? 'bold' : 'normal')};
  color: ${(props) => (props.category === props.id ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
    text-decoration: ${(props) => (props.category === props.id ? 'none' : 'underline')};
  }
`;
const ListBox = styled.div``;
