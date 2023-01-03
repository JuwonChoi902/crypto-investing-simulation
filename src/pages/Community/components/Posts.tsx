import React from 'react';
import styled from 'styled-components';

interface PostData {
  posts: PostDetail[];
  number: number;
}

interface PostDetail {
  id: number;
  title: string;
  description: string;
  created_at: string;
  hits: number;
  user: UserDetail;
}

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

const PostData: PostData = {
  posts: [
    {
      id: 2,
      title: '갓갓',
      description: '거석',
      created_at: '2022-12-14T06:58:03.000Z',
      hits: 50,
      user: {
        id: 1,
        nickname: '피엔',
        description: null,
      },
    },
    {
      id: 3,
      title: '갓갓',
      description: '거석',
      created_at: '2022-12-14T06:58:03.000Z',
      hits: 40,
      user: {
        id: 1,
        nickname: '피엔',
        description: null,
      },
    },
    {
      id: 6,
      title: '갓갓',
      description: '거석',
      created_at: '2022-12-14T07:14:35.000Z',
      hits: 60,
      user: {
        id: 1,
        nickname: '피엔',
        description: null,
      },
    },
    {
      id: 7,
      title: '갓갓',
      description: '거석',
      created_at: '2022-12-14T07:14:35.000Z',
      hits: 20,
      user: {
        id: 1,
        nickname: '피엔',
        description: null,
      },
    },
    {
      id: 8,
      title: '갓갓',
      description: '거석',
      created_at: '2022-12-14T07:14:36.000Z',
      hits: 50,
      user: {
        id: 1,
        nickname: '피엔',
        description: null,
      },
    },
  ],
  number: 7,
};

export default function Posts() {
  return (
    <OuterBox>
      <WhatIsList>전체글보기</WhatIsList>
      <HowManyPosts>10,387개의 글</HowManyPosts>
      <PostsBox>
        <TableTitles>
          <TableEmpty />
          <TableTitle>제목</TableTitle>
          <TableUser>작성자</TableUser>
          <TableDate>작성일</TableDate>
          <TableHit>조회</TableHit>
        </TableTitles>
        <PostList>
          {PostData.map((el) => (
            <Post>
              <LabelAndTitle>
                <Label>질문</Label>
                <Title>{el.title}</Title>
              </LabelAndTitle>
              <User>{el.user.nickname}</User>
              <Date>{el.created_at}</Date>
              <Hits>{el.hits}</Hits>
            </Post>
          ))}
        </PostList>
      </PostsBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 860px;
  font-size: 20px;
  margin-left: 16px;
  font-weight: bold;
`;
const WhatIsList = styled.div``;
const HowManyPosts = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  padding: 6px 0 10px 0;
  font-size: 12px;
  border-bottom: 1px solid black;
`;
const PostsBox = styled.div`
  background-color: white;
`;
const TableTitles = styled.div`
  display: flex;
  align-items: center;
  height: 45px;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid #e5e5e5; ;
`;

const TableEmpty = styled.div`
  width: 88px;
`;
const TableTitle = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 506px;
`;
const TableUser = styled.div`
  display: flex;
  align-items: center;
  width: 106px;
  padding: 0px 6px;
`;
const TableDate = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 80px;
`;
const TableHit = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 68px;
`;

const PostList = styled.div``;
const Post = styled.div`
  display: flex;
  font-size: 12px;
  height: 28px;
  padding: 4px 0px;
  border-bottom: 1px solid #e5e5e5;
`;
const LabelAndTitle = styled.div`
  display: flex;
  width: 564px;
  padding: 0px 18px 0px 12px;
`;
const Label = styled.div`
  display: flex;
  align-items: center;
  width: 69px;
  padding-right: 7px;
`;
const Title = styled.div`
  display: flex;
  align-items: center;
`;
const User = styled.div`
  display: flex;
  align-items: center;
  width: 104px;
  padding: 0px 7px;
`;
const Date = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 66px;
  padding: 0px 7px;
`;
const Hits = styled.div`
  ${(props) => props.theme.variables.flex()}

  width: 54px;
  padding: 0px 7px;
`;
