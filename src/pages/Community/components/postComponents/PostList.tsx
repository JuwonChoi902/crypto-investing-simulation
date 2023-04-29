import React, { useEffect, useRef, useState } from 'react';
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
  categoryId: number;
  prevPostId: number | null;
  nextPostId: number | null;
  user: UserDetail;
}

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

interface SearchRes {
  stringRes: string;
  filterRes: string;
  boardRes: number | null;
}

type PostListProps = {
  setPosts: React.Dispatch<React.SetStateAction<PostDetail[] | undefined>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
  setPostNumber: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSearchRes: React.Dispatch<React.SetStateAction<SearchRes>>;
  setIsItSearching: React.Dispatch<React.SetStateAction<boolean>>;
  searchRes: SearchRes;
  isItSearching: boolean;
  boardNow: number | null;
  page: number;
  posts: PostDetail[] | undefined;
};

interface Headers {
  'Content-Type': string;
  Authorization?: string;
  [key: string]: string | undefined;
}

const Category: string[] = ['전체글보기', '질문하기', '자랑하기', '공유하기', '잡담하기'];

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
  const refs = useRef(Array.from({ length: 10 }, () => React.createRef<HTMLDivElement>()));
  const nickRefs = useRef(Array.from({ length: 10 }, () => React.createRef<HTMLDivElement>()));

  const loginUserToken = localStorage.getItem('accessToken');

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
    const headers: Headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    if (loginUserToken) {
      headers.Authorization = `Bearer ${loginUserToken}`;
    } else {
      delete headers.Authorization;
    }

    if (!isItSearching) {
      setSearchRes({ stringRes: '', filterRes: '', boardRes: boardNow });
      setPage(1);
      fetch(`http://pien.kr:4000/community?page=1&number=10&categoryId=${boardNow}`, {
        headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            setPostNumber(data.data.number);
            setPosts(
              data.data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })),
            );
          }
        });
    }
  }, [boardNow, isItSearching]);

  useEffect(() => {
    const headers: Headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    if (loginUserToken) {
      headers.Authorization = `Bearer ${loginUserToken}`;
    } else {
      delete headers.Authorization;
    }

    if (isItSearching) {
      fetch(
        `http://pien.kr:4000/community?page=${page}&number=10&categoryId=${boardRes}&filter=${filterRes}&search=${stringRes}`,
        {
          headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            setPostNumber(data.data.number);
            setPosts(
              data.data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })),
            );
          }
        });
    } else {
      fetch(`http://pien.kr:4000/community?page=${page}&number=10&categoryId=${boardNow}`, {
        headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            setPostNumber(data.data.number);
            setPosts(
              data.data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })),
            );
          }
        });
    }
  }, [page]);

  return (
    <OuterBox>
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
                {el.repliesCount === 0 ? null : <RepliesCount>[{el.repliesCount}]</RepliesCount>}
                {el.created_at[1] ? <IsItNew>N</IsItNew> : null}
              </Title>
            </LabelAndTitle>
            <User ref={nickRefs.current[i]} onClick={() => setDropBox(i)}>
              {el.user.nickname}
              {i === dropBox ? (
                <UserDropBox ref={refs.current[i]}>
                  <ul>
                    <li
                      role='presentation'
                      onClick={() => {
                        if (!loginUserToken) {
                          if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                            navigate('/login');
                          }
                        } else {
                          setProfileId(el.user.id);
                          setMenuNow(2);
                        }
                      }}
                    >
                      프로필보기
                    </li>
                    <li
                      role='presentation'
                      onClick={() => {
                        if (!loginUserToken) {
                          if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                            navigate('/login');
                          }
                        } else {
                          alert('서비스 준비중입니다.');
                        }
                      }}
                    >
                      1:1 채팅
                    </li>
                    <li
                      role='presentation'
                      onClick={() => {
                        if (!loginUserToken) {
                          if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                            navigate('/login');
                          }
                        } else {
                          alert('서비스 준비중입니다.');
                        }
                      }}
                    >
                      쪽지보내기
                    </li>
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
`;
const Post = styled.div`
  display: flex;
  font-size: 12px;
  height: 28px;
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
  /* margin-right: 74px; */
  padding: 0px 7px;
  position: relative;

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
`;
const Hits = styled.div`
  ${(props) => props.theme.variables.flex()}

  width: 54px;
  padding: 0px 7px;
  font-weight: normal;
`;
