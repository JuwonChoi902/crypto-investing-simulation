import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Pages from '../otherComponents/Pages';

interface PostDetail {
  id: number;
  title: string;
  description: string;
  hits: number;
  categoryId: number;
  created_at: string;
  repliesCount: number;
  isLike: boolean;
  likeCount: number;
  isPublished: boolean;
  unLikeCount: number;
  prevPostId: number | null;
  nextPostId: number | null;
  user: UserDetail;
}

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

export default function CommentedPost() {
  const [postsData, setPostsData] = useState<PostDetail[]>([]);
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

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

  useEffect(() => {
    fetch(`http://pien.kr:4000/user/posts`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPostsData(data.map((post: PostDetail) => ({ ...post, created_at: dateParsing(post.created_at) })));
      });
  }, []);

  return (
    <OuterBox>
      <ListCategories>
        <LCTitle>제목</LCTitle>
        <LCNick>작성자</LCNick>
        <LCDate>작성일</LCDate>
        <LCHit>조회</LCHit>
      </ListCategories>
      {postsData.length ? (
        <List>
          {postsData.map((post) => (
            <Post key={post.id}>
              <PostTitleBox>
                <PostId>{post.id}</PostId>
                <PostTitle onClick={() => (post.isPublished ? navigate(`/community/${post.id}`) : null)}>
                  {post.title}
                  {post.repliesCount === 0 ? null : <RepliesCount>[{post.repliesCount}]</RepliesCount>}
                  {post.created_at[1] ? <IsItNew>N</IsItNew> : null}
                </PostTitle>
              </PostTitleBox>
              <PostNick>기석</PostNick>
              <PostDate>{post.created_at}</PostDate>
              <PostHit>{post.hits}</PostHit>
            </Post>
          ))}
        </List>
      ) : (
        <EmptyList>삭제한 게시글이 없습니다.</EmptyList>
      )}
      {/* <ButtonBox>
        <SelectAll />
        <DeleteAndWrite>
          <WriteBtn onClick={() => navigate('/community/posting')}>글쓰기</WriteBtn>
        </DeleteAndWrite>
      </ButtonBox> */}
    </OuterBox>
  );
}

const OuterBox = styled.div``;
const ListCategories = styled.div`
  display: flex;
  width: 860px;
  font-size: 13px;
  font-weight: bold;
  border-top: 1px solid black;
  border-bottom: 1px solid #e5e5e5;
`;
const LCTitle = styled.div`
  ${(props) => props.theme.variables.flex()};
  padding-left: 30px;
  width: 630px;
  height: 45px;
`;

const LCNick = styled.div`
  ${(props) => props.theme.variables.flex()};

  width: 122px;
  padding: 2px 7px;
  font-weight: bold;
`;

const LCDate = styled.div`
  ${(props) => props.theme.variables.flex()}
  width:120px;
  height: 45px;
`;
const LCHit = styled.div`
  ${(props) => props.theme.variables.flex()}
  width:80px;
  height: 45px;
`;

const List = styled.div``;
const Post = styled.div`
  display: flex;
  width: 860px;
  height: 37px;
  border-bottom: 1px solid #e5e5e5;
`;
const PostTitleBox = styled.div`
  width: 660px;
  display: flex;
`;

const PostId = styled.div`
  ${(props) => props.theme.variables.flex()}
  color:#878787;
  width: 50px;
  font-size: 11px;
  margin-right: 15px;
`;
const PostTitle = styled.div`
  ${(props) => props.theme.variables.flex()}
  font-size: 13px;

  span {
    font-style: italic;
    color: #878787;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const PostNick = styled.div`
  ${(props) => props.theme.variables.flex()}

  font-size: 13px;
  width: 122px;
  padding: 2px 7px;
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

const PostDate = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 120px;
  font-size: 12px;
`;
const PostHit = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 80px;
  font-size: 12px;
`;

const EmptyList = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 860px;
  height: 37px;
  font-size: 13px;
  border-bottom: 1px solid #e5e5e5;
`;
const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  height: 34px;
  margin: 10px 0px 34px 0px;
`;
const SelectAll = styled.div`
  ${(props) => props.theme.variables.flex()}
`;

const DeleteAndWrite = styled.div`
  display: flex;
`;

const WriteBtn = styled.button`
  border: none;
  background-color: #eff0f2;
  margin-left: 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 14px;
  &:hover {
    cursor: pointer;
  }
`;