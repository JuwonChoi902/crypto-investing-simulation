import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useOnClickOutside } from 'usehooks-ts';
import styled from 'styled-components';
import { ObjectType } from 'typescript';

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
  setProfileId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
  setPostNumber: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSearchRes: React.Dispatch<React.SetStateAction<SearchRes>>;
  searchRes: SearchRes;
  isItSearching: boolean;
  boardNow: number | null;
  page: number;
  posts: PostDetail[] | undefined;
};

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
}: PostListProps) {
  const [dropBox, setDropBox] = useState<number | null>(null);
  const dropBoxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { stringRes, filterRes, boardRes } = searchRes;

  // const refs = useRef<any>(Array.from({ length: 10 }, () => React.createRef()));
  const refs = useRef<any>(Array.from({ length: 10 }, () => React.createRef()));

  // console.log(refs);

  // // useEffect(() => {
  // //   refs.current[0].current.focus();
  // // }, []);

  // const handleClickOutside = () => {
  //   setDropBox(null);
  // };

  // useEffect(() => {
  //   const changeDropState = (e: any) => {
  //     if (refs.current[dropBox].current !== null && !refs.current[dropBox].current.contains(e.target)) {
  //       setDropBox(null);
  //     }
  //   };

  //   if (dropBox) {
  //     window.addEventListener('click', changeDropState);
  //   }

  //   return () => {
  //     window.removeEventListener('click', changeDropState);
  //   };
  // }, [dropBox]);

  // useEffect(() => {
  //   if (dropBox) {
  //     useOnClickOutside(refs[dropBox as keyof number], handleClickOutside);
  //   }
  // }, [dropBox]);

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
    if (!isItSearching) {
      setSearchRes({ stringRes: '', filterRes: '', boardRes: boardNow });
      setPage(1);
      fetch(`http://pien.kr:4000/community?page=1&number=10&categoryId=${boardNow}`, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPostNumber(data.number);
          setPosts(data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })));
        });
    }
  }, [boardNow, isItSearching]);

  useEffect(() => {
    if (isItSearching) {
      fetch(
        `http://pien.kr:4000/community?page=${page}&number=10&categoryId=${boardRes}&filter=${filterRes}&search=${stringRes}`,
        {
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          setPostNumber(data.number);
          setPosts(data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })));
        });
    } else {
      fetch(`http://pien.kr:4000/community?page=${page}&number=10&categoryId=${boardNow}`, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPostNumber(data.number);
          setPosts(data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })));
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
              <Label onClick={() => setBoardNow(el.categoryId)}>{Category[el.categoryId].slice(0, 2)}</Label>
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
            <User
              onClick={() => {
                setDropBox(i);
              }}
            >
              {el.user.nickname}
              <UserDropBox id={i} dropBox={dropBox} ref={refs.current[i]}>
                <ul>
                  <li
                    role='presentation'
                    onClick={() => {
                      setProfileId(el.user.id);
                      setMenuNow(2);
                    }}
                  >
                    프로필보기
                  </li>
                  <li>1:1 채팅</li>
                  <li>쪽지보내기</li>
                </ul>
              </UserDropBox>
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
  width: 30px;
  margin-right: 74px;
  padding: 0px 7px;
  position: relative;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const UserDropBox = styled.div<{ dropBox: number | null; id: any }>`
  display: ${(props) => (props.id === props.dropBox ? 'block' : 'none')};
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
