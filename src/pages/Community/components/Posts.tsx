import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

interface PostDetail {
  id: number;
  title: string;
  description: string;
  created_at: string;
  repliesCount: number;
  hits: number;
  label: string;
  user: UserDetail;
}

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

export default function Posts() {
  const [posts, setPosts] = useState<PostDetail[]>();
  const [postNumber, setPostNumber] = useState<number>();
  const navigate = useNavigate();

  console.log(posts);

  useEffect(() => {
    const dateParsing = (date: string): [string, boolean] => {
      const theDate = new Date(date);
      const todayDate = new Date();
      const oneDayPlus = new Date(date);
      oneDayPlus.setDate(oneDayPlus.getDate() + 1);
      const strTheDate = theDate.toLocaleString();
      const strTodayDate = todayDate.toLocaleString();

      const isItInOneDay = oneDayPlus >= todayDate;

      if (
        strTheDate.slice(0, strTheDate.indexOf('오') - 1) !==
        strTodayDate.slice(0, strTodayDate.indexOf('오') - 1)
      ) {
        return [
          `${theDate.getFullYear()}.${String(theDate.getMonth() + 1).padStart(2, '0')}.${String(
            theDate.getDate(),
          ).padStart(2, '0')}.`,
          isItInOneDay,
        ];
      }
      return [
        `${String(theDate.getHours()).padStart(2, '0')}:${String(theDate.getMinutes()).padStart(2, '0')}`,
        isItInOneDay,
      ];
    };

    fetch(`http://pien.kr:4000/community?page=1&number=10`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPostNumber(data.number);
        setPosts(data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })));
      });
  }, []);

  const goPost = () => {
    navigate('/community/posting');
  };

  return (
    <OuterBox>
      <WhatIsList>전체글보기</WhatIsList>
      <HowManyPosts>
        {postNumber}개의 글
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
          {posts?.map((el, i) => (
            <Post key={el.id}>
              <LabelAndTitle>
                <Label>{el.label}</Label>
                <Title
                  onClick={() =>
                    navigate(`/community/${el.id}`, {
                      state: {
                        currentIndex: i,
                        posts,
                      },
                    })
                  }
                >
                  {el.title}
                  {el.repliesCount === 0 ? null : <RepliesCount>[{el.repliesCount}]</RepliesCount>}
                  {el.created_at[1] ? <IsItNew>N</IsItNew> : null}
                </Title>
              </LabelAndTitle>
              <User>{el.user.nickname}</User>
              <DateInPost>{el.created_at[0]}</DateInPost>
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
const Title = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const RepliesCount = styled.div`
  font-weight: bold;
  margin-left: 5px;
  color: ${(props) => props.theme.style.red};
`;

const IsItNew = styled.div`
  ${(props) => props.theme.variables.flex()};
  background-color: red;
  width: 12px;
  height: 12px;
  font-size: 10px;
  color: white;
  border-radius: 100%;
  margin-left: 5px;
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
  font-weight: normal;
`;
const Hits = styled.div`
  ${(props) => props.theme.variables.flex()}

  width: 54px;
  padding: 0px 7px;
  font-weight: normal;
`;
