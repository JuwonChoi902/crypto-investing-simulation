import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import SearchBarTop from './SearchBarTop';
import SearchBarUnder from './SearchBarUnder';
import PostList from './PostList';
import Pages from '../otherComponents/Pages';
import { PostDataType } from '../../../../typing/types';

type PostsProps = {
  boardNow: number | null;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  isItSearching: boolean;
  setIsItSearching: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
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
  const [posts, setPosts] = useState<PostDataType[]>();
  const [postNumber, setPostNumber] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [searchRes, setSearchRes] = useState({
    filterRes: '',
    stringRes: '',
    boardRes: boardNow,
  });

  const navigate = useNavigate();
  const loginUserToken = localStorage.getItem('accessToken');

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
        <button
          type='button'
          onClick={() => {
            if (!loginUserToken) {
              if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                navigate('/login');
              }
            } else {
              navigate('/community/posting');
            }
          }}
        >
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
          setIsItSearching={setIsItSearching}
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
const WhatIsList = styled.div`
  white-space: nowrap;
`;
const HowManyPosts = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 6px 0 10px 0;
  font-size: 12px;
  border-bottom: 1px solid black;
  white-space: nowrap;

  button {
    /* background-color: ${(props) => props.theme.style.backgroundGrey}; */
    background-color: white;
    border: none;
    white-space: nowrap;
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
  border-bottom: 1px solid #e5e5e5;
  white-space: nowrap;
`;

const TableEmpty = styled.div`
  white-space: nowrap;

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
