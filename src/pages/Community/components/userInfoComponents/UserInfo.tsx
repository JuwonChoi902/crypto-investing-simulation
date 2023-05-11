import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import PostHistory from './PostHistory';
import CommentHistory from './CommentHistory';
import CommentedPost from './CommentedPost';
import LikeHistory from './LikeHistory';
import IncomeInfo from './IncomeInfo';
import DeletedHistory from './DeletedHistory';
import UserProfile from './UserProfile';

type UserInfoProps = {
  profileId: number | null | undefined;
};

export default function UserInfo({ profileId }: UserInfoProps) {
  const [category, setCategory] = useState<string>('0');
  const navigate = useNavigate();
  const loginUserId = Number(localStorage.getItem('id'));

  const categories: string[] = ['작성글', '작성댓글', '댓글단 글', '좋아요한 글', '수익률'];
  useEffect(() => {
    navigate(`/community/profile`);
  }, [category]);

  return (
    <OuterBox>
      <UserProfile profileId={profileId} />
      <Main>
        <CategoryBox>
          <CategoryLeft>
            {categories.map((c, i) => (
              <Category
                id={String(i)}
                category={category}
                onClick={() => {
                  if (i === 4) alert('서비스 준비중입니다.');
                  else setCategory(String(i));
                }}
                key={c}
              >
                {c}
              </Category>
            ))}
          </CategoryLeft>
          <CategoryRight>
            {profileId === loginUserId ? (
              <Category id={String(5)} category={category} onClick={() => setCategory(String(5))}>
                삭제한 게시글
              </Category>
            ) : null}
          </CategoryRight>
        </CategoryBox>
        <ListBox>
          {category === '0' ? <PostHistory profileId={profileId} /> : null}
          {category === '1' ? <CommentHistory profileId={profileId} /> : null}
          {category === '2' ? <CommentedPost profileId={profileId} /> : null}
          {category === '3' ? <LikeHistory profileId={profileId} /> : null}
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
  white-space: nowrap;
`;
const CategoryRight = styled.div`
  white-space: nowrap;
`;
const Category = styled.div<{ id: string; category: string }>`
  margin-right: 16px;
  padding-bottom: 5px;
  white-space: nowrap;
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
