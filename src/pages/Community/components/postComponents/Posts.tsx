import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import SearchBarTop from './SearchBarTop';
import SearchBarUnder from './SearchBarUnder';
import PostList from './PostList';
import Pages from '../otherComponents/Pages';

interface PostDetail {
  id: number;
  title: string;
  description: string;
  created_at: string;
  repliesCount: number;
  hits: number;
  label: string;
  categoryId: number;
  user: UserDetail;
}

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

type PostsProps = {
  boardNow: number | null;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  isItSearching: boolean;
  setIsItSearching: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
};

const Category: string[] = ['전체글보기', '질문하기', '자랑하기', '공유하기', '잡담하기'];

export default function Posts({
  boardNow,
  setBoardNow,
  isItSearching,
  setIsItSearching,
  setProfileId,
  setMenuNow,
}: PostsProps) {
  const [posts, setPosts] = useState<PostDetail[]>();
  const [postNumber, setPostNumber] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [searchRes, setSearchRes] = useState({
    filterRes: '',
    stringRes: '',
    boardRes: boardNow,
  });

  const navigate = useNavigate();

  return (
    <OuterBox>
      {isItSearching ? (
        <SearchBarTop
          setBoardNow={setBoardNow}
          setPostNumber={setPostNumber}
          setPosts={setPosts}
          searchRes={searchRes}
          setSearchRes={setSearchRes}
        />
      ) : null}
      {isItSearching ? (
        <SearchResult>{`'${searchRes.stringRes}'의 검색 결과입니다.`}</SearchResult>
      ) : (
        <WhatIsList>{boardNow !== null ? Category[boardNow] : null}</WhatIsList>
      )}
      <HowManyPosts>
        {postNumber}개의 글
        <button type='button' onClick={() => navigate('/community/posting')}>
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
        <PostList
          setPosts={setPosts}
          setBoardNow={setBoardNow}
          setProfileId={setProfileId}
          setMenuNow={setMenuNow}
          setPostNumber={setPostNumber}
          setPage={setPage}
          setSearchRes={setSearchRes}
          isItSearching={isItSearching}
          page={page}
          posts={posts}
          boardNow={boardNow}
          searchRes={searchRes}
        />
      </PostsBox>
      <SearchAndPages>
        <SearchBarUnder
          setPosts={setPosts}
          setPostNumber={setPostNumber}
          setSearchRes={setSearchRes}
          setIsItSearching={setIsItSearching}
          boardNow={boardNow}
        />
        <Pages postNumber={postNumber} setPage={setPage} page={page} limit={10} />
      </SearchAndPages>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 860px;
  font-size: 20px;
  margin-left: 16px;
  font-weight: bold;
`;
const SearchResult = styled.div``;
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

const SearchAndPages = styled.div`
  display: flex;
  justify-content: end;
`;
