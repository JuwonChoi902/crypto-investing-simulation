import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
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
  label: string;
  user: UserDetail;
}

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

// const PostData: PostData = {
//   posts: [
//     {
//       id: 2,
//       title: '갓갓',
//       description: '거석',
//       created_at: '2022-12-14T06:58:03.000Z',
//       hits: 50,
//       user: {
//         id: 1,
//         nickname: '피엔',
//         description: null,
//       },
//     },
//     {
//       id: 3,
//       title: '갓갓',
//       description: '거석',
//       created_at: '2022-12-14T06:58:03.000Z',
//       hits: 40,
//       user: {
//         id: 1,
//         nickname: '피엔',
//         description: null,
//       },
//     },
//     {
//       id: 6,
//       title: '갓갓',
//       description: '거석',
//       created_at: '2022-12-14T07:14:35.000Z',
//       hits: 60,
//       user: {
//         id: 1,
//         nickname: '피엔',
//         description: null,
//       },
//     },
//     {
//       id: 7,
//       title: '갓갓',
//       description: '거석',
//       created_at: '2022-12-14T07:14:35.000Z',
//       hits: 20,
//       user: {
//         id: 1,
//         nickname: '피엔',
//         description: null,
//       },
//     },
//     {
//       id: 8,
//       title: '갓갓',
//       description: '거석',
//       created_at: '2022-12-14T07:14:36.000Z',
//       hits: 50,
//       user: {
//         id: 1,
//         nickname: '피엔',
//         description: null,
//       },
//     },
//   ],
//   number: 7,
// };

interface AboutProps {
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function Posts<AboutProps>({ setPostNow }: any) {
  const [posts, setPosts] = useState<PostDetail[]>();
  const navigate = useNavigate();

  useEffect(() => {
    const dateParsing = (date: string): string => {
      const theDate = new Date(date);
      const todayDate = new Date();
      const strTheDate = theDate.toLocaleString();
      const strTodayDate = todayDate.toLocaleString();

      if (
        strTheDate.slice(0, strTheDate.indexOf('오') - 1) !==
        strTodayDate.slice(0, strTodayDate.indexOf('오') - 1)
      ) {
        return `${theDate.getFullYear()}.${String(theDate.getMonth() + 1).padStart(2, '0')}.${String(
          theDate.getDate(),
        ).padStart(2, '0')}.`;
      }
      return `${String(theDate.getHours()).padStart(2, '0')}:${String(theDate.getMinutes()).padStart(
        2,
        '0',
      )}`;
    };

    fetch(`http://pien.kr:4000/community?page=1&number=10`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setPosts(data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) }))),
      );
  }, []);

  const goPost = (e: any) => {
    navigate('/community/post');
  };

  return (
    <OuterBox>
      <WhatIsList>전체글보기</WhatIsList>
      <HowManyPosts>
        {posts?.length}개의 글
        <button type='button' onClick={goPost}>
          글 작성하기
        </button>
      </HowManyPosts>
      <PostsBox>
        <TableTitles>
          <TableEmpty />
          <TableTitle>제목</TableTitle>
          <TableUser>작성자</TableUser>
          <TableDate>작성일</TableDate>
          <TableHit>조회</TableHit>
        </TableTitles>
        <PostList>
          {posts?.map((el) => (
            <Post key={el.id}>
              <LabelAndTitle>
                <Label>{el.label}</Label>
                <Title
                  id={el.id}
                  onClick={(e) => {
                    if (e.target instanceof Element) {
                      setPostNow(Number(e.target.id));
                    }
                  }}
                >
                  {el.title}
                </Title>
              </LabelAndTitle>
              <User>{el.user.nickname}</User>
              <DateInPost>{el.created_at}</DateInPost>
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
  justify-content: space-between;
  height: 30px;
  padding: 6px 0 10px 0;
  font-size: 12px;
  border-bottom: 1px solid black;

  button {
    /* background-color: ${(props) => props.theme.style.backgroundGrey}; */
    background-color: white;
    border: none;
  }

  button:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
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

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const Title = styled.div<{ id: any }>`
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const User = styled.div`
  display: flex;
  align-items: center;
  width: 104px;
  padding: 0px 7px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const DateInPost = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 66px;
  padding: 0px 7px;
`;
const Hits = styled.div`
  ${(props) => props.theme.variables.flex()}

  width: 54px;
  padding: 0px 7px;
`;
