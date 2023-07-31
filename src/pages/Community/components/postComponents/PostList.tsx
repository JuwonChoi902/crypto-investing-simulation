import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { PostDataType, SearchResType } from '../../../../typing/types';
import { makeHeaders, getPostListData } from '../../../../utils/functions';

type PostListProps = {
  setPosts: React.Dispatch<React.SetStateAction<PostDataType[] | undefined>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
  setPostNumber: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSearchRes: React.Dispatch<React.SetStateAction<SearchResType>>;
  setIsItSearching: React.Dispatch<React.SetStateAction<boolean>>;
  searchRes: SearchResType;
  isItSearching: boolean;
  boardNow: number | null;
  page: number;
  posts: PostDataType[] | undefined;
};

const Category: string[] = ['전체글보기', '질문하기', '자랑하기', '공유하기', '잡담하기'];
const DropBoxMenu: string[] = ['프로필보기', '1:1 채팅', '쪽지보내기'];

export default function PostList({
  setPosts,
  setBoardNow,
  setProfileId,
  setMenuNow,
  setPostNumber,
  setPage,
  setSearchRes,
  isItSearching,
  posts,
  boardNow,
  page,
  searchRes,
  setIsItSearching,
}: PostListProps) {
  const [dropBox, setDropBox] = useState<number | null>(null);
  const { stringRes, filterRes, boardRes } = searchRes;
  const navigate = useNavigate();
  const loginUserToken = localStorage.getItem('accessToken');
  const memoizedMakeHeaders = useCallback(makeHeaders, []);
  const memoizedGetList = useCallback(getPostListData, []);

  const refs = useRef(Array.from({ length: 10 }, () => React.createRef<HTMLDivElement>()));
  const nickRefs = useRef(Array.from({ length: 10 }, () => React.createRef<HTMLDivElement>()));

  useEffect(() => {
    const changeDropState = (e: CustomEvent<MouseEvent>) => {
      if (
        dropBox !== null &&
        nickRefs.current[dropBox].current &&
        refs.current[dropBox].current &&
        !refs.current[dropBox].current?.contains(e.target as Node) &&
        !nickRefs.current[dropBox].current?.contains(e.target as Node)
      ) {
        setDropBox(null);
      }
    };

    if (dropBox !== null) {
      window.addEventListener('click', changeDropState as EventListener);
    }

    return () => {
      window.removeEventListener('click', changeDropState as EventListener);
    };
  }, [dropBox]);

  useEffect(() => {
    const headers = memoizedMakeHeaders(loginUserToken);
    if (!isItSearching) {
      setSearchRes({ stringRes: '', filterRes: '', boardRes: boardNow });
      setPage(1);
      memoizedGetList(
        isItSearching,
        1,
        boardNow,
        boardRes,
        filterRes,
        stringRes,
        headers,
        setPostNumber,
        setPosts,
      );
    }
  }, [boardNow, isItSearching]);

  useEffect(() => {
    const headers = memoizedMakeHeaders(loginUserToken);
    memoizedGetList(
      isItSearching,
      page,
      boardNow,
      boardRes,
      filterRes,
      stringRes,
      headers,
      setPostNumber,
      setPosts,
    );
  }, [page]);

  return (
    <OuterBox data-testid='postlist-component'>
      {posts?.length === 0 ? (
        <EmptyPosts>등록된 게시글이 없습니다.</EmptyPosts>
      ) : (
        posts?.map((el, i) => (
          <Post key={el.id}>
            <LabelAndTitle>
              <Label
                onClick={() => {
                  setBoardNow(el.categoryId);
                  setIsItSearching(false);
                }}
              >
                {Category[el.categoryId].slice(0, 2)}
              </Label>
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
                <ReplyAndNew>
                  {el.repliesCount === 0 ? null : <RepliesCount>[{el.repliesCount}]</RepliesCount>}
                  {el.created_at[1] ? <IsItNew>N</IsItNew> : null}
                </ReplyAndNew>
              </Title>
            </LabelAndTitle>
            <User ref={nickRefs.current[i]} onClick={() => setDropBox(i)}>
              {el.user.nickname}
              {i === dropBox ? (
                <UserDropBox ref={refs.current[i]}>
                  <ul>
                    {DropBoxMenu.map((menu, index) => (
                      <li
                        key={menu}
                        role='presentation'
                        onClick={() => {
                          if (!loginUserToken) {
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                              navigate('/login');
                            }
                          } else if (index === 0) {
                            setProfileId(el.user.id);
                            setMenuNow(2);
                          } else {
                            alert('서비스 준비중입니다.');
                          }
                        }}
                      >
                        {menu}
                      </li>
                    ))}
                  </ul>
                </UserDropBox>
              ) : null}
            </User>

            <DateInPost>{el.created_at[0]}</DateInPost>
            <Hits>{el.hits}</Hits>
          </Post>
        ))
      )}
    </OuterBox>
  );
}

const OuterBox = styled.div``;
const EmptyPosts = styled.div`
  ${(props) => props.theme.variables.flex()};
  height: 220px;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid #e5e5e5;
  white-space: nowrap;
`;
const Post = styled.div`
  display: flex;
  font-size: 12px;
  min-height: 28px;
  padding: 4px 0px;
  border-bottom: 1px solid #e5e5e5;
`;
const LabelAndTitle = styled.div`
  display: flex;
  width: 565px;
  padding: 0px 18px 0px 12px;
`;
const Label = styled.div`
  display: flex;
  align-items: center;
  min-width: 69px;
  padding-right: 7px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  /* flex-wrap: wrap; */
  /* white-space: normal; */
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const ReplyAndNew = styled.div`
  display: flex;
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
  /* margin-right: 74px; */
  padding: 0px 7px;
  position: relative;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const UserDropBox = styled.div`
  display: block;
  position: absolute;
  width: 113px;
  top: 23px;
  left: 7px;
  font-size: 12px;
  z-index: 1;
  font-weight: bold;
  background-color: white;
  border: 1px solid #e5e5e5;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  white-space: nowrap;

  li {
    padding: 11px 15px;

    &:hover {
      cursor: pointer;
      background-color: #feeaa3;
    }
  }
`;

const DateInPost = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 66px;
  padding: 0px 7px;
  font-weight: normal;
  white-space: nowrap;
`;
const Hits = styled.div`
  ${(props) => props.theme.variables.flex()}

  width: 54px;
  padding: 0px 7px;
  font-weight: normal;
  white-space: nowrap;
`;
