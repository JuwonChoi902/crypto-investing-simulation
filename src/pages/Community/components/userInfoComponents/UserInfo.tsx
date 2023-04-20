import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import HeaderBox from './HeaderBox';
import PostHistory from './PostHistory';
import CommentHistory from './CommentHistory';
import CommentedPost from './CommentedPost';
import LikeHistory from './LikeHistory';
import IncomeInfo from './IncomeInfo';
import DeletedHistory from './DeletedHistory';

type UserInfoProps = {
  profileId: number | undefined;
};

export default function UserInfo({ profileId }: UserInfoProps) {
  const [category, setCategory] = useState<string>('0');
  const navigate = useNavigate();

  const categories: string[] = ['작성글', '작성댓글', '댓글단 글', '좋아요한 글', '수익률'];
  useEffect(() => {
    navigate(`/community/profile`);
  }, [category]);

  return (
    <OuterBox>
      <HeaderBox />
      <Main>
        <CategoryBox>
          <CategoryLeft>
            {categories.map((c, i) => (
              <Category id={String(i)} category={category} onClick={() => setCategory(String(i))} key={c}>
                {c}
              </Category>
            ))}
          </CategoryLeft>
          <CategoryRight>
            <Category id={String(5)} category={category} onClick={() => setCategory(String(5))}>
              삭제한 게시글
            </Category>
          </CategoryRight>
        </CategoryBox>
        <ListBox>
          {category === '0' ? <PostHistory profileId={profileId} /> : null}
          {category === '1' ? <CommentHistory /> : null}
          {category === '2' ? <CommentedPost /> : null}
          {category === '3' ? <LikeHistory /> : null}
          {category === '4' ? <IncomeInfo /> : null}
          {category === '5' ? <DeletedHistory /> : null}
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
const Category = styled.div<{ id: string; category: string }>`
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
