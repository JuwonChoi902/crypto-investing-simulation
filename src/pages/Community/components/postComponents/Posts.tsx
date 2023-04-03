import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import SearchBar from './SearchBar';
import pageLeft from '../../images/pageLeft.png';
import pageRight from '../../images/pageRight.png';
import arrowDown from '../../images/arrowDown.png';
import arrowUp from '../../images/arrowUp.png';

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
};

const Category: string[] = ['전체글보기', '질문하기', '자랑하기', '공유하기', '잡담하기'];

export default function Posts({ boardNow, setBoardNow, isItSearching, setIsItSearching }: PostsProps) {
  const [posts, setPosts] = useState<PostDetail[]>();
  const [postNumber, setPostNumber] = useState<number>();
  const [postPage, setPostPage] = useState<number>(1);
  const [dropBox, setDropBox] = useState<number | null>(null);
  const [searchDropIsOpen, setSearchDropIsOpen] = useState<boolean>(false);
  const [searchFilterNow, setSearchFilterNow] = useState<string>('제목 + 내용');
  const [searchInput, setSearchInput] = useState({
    searchFilter: 'content',
    searchString: '',
  });
  const [searchRes, setSearchRes] = useState({
    filterRes: '',
    stringRes: '',
    boardRes: boardNow,
  });

  const { searchFilter, searchString } = searchInput;

  const navigate = useNavigate();
  const dropBoxRef = useRef<null[] | HTMLDivElement[]>([]);
  const searchDropRef = useRef<HTMLDivElement>(null);

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
      setPostPage(1);
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
        `http://pien.kr:4000/community?page=${postPage}&number=10&categoryId=${boardNow}&filter=${searchFilter}&search=${searchString}`,
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
      fetch(`http://pien.kr:4000/community?page=${postPage}&number=10&categoryId=${boardNow}`, {
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
  }, [postPage]);

  const makeSearchFilter = (event: any, str: string) => {
    setSearchInput({ ...searchInput, searchFilter: str });
  };

  useEffect(() => {
    if (searchFilter === 'content') setSearchFilterNow('제목 + 내용');
    if (searchFilter === 'nickname') setSearchFilterNow('작성자');
    if (searchFilter === 'reply') setSearchFilterNow('댓글내용');
  }, [searchFilter]);

  useEffect(() => {
    const changeDropState = (e: any) => {
      if (searchDropRef.current !== null && !searchDropRef.current?.contains(e.target)) {
        setSearchDropIsOpen((cur) => !cur);
      }
    };

    if (searchDropIsOpen) {
      window.addEventListener('click', changeDropState);
    }

    return () => {
      window.removeEventListener('click', changeDropState);
    };
  }, [searchDropIsOpen]);

  // useEffect(() => {
  //   const changeDropState = (e: any) => {
  //     if (dropBoxRef.current !== null && !dropBoxRef.current?.contains(e.target)) {
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

  const makeSearchInput = (event: any) => {
    if (event.key === 'Enter') search(event);
    setSearchInput({ ...searchInput, searchString: event.target.value });
  };

  const search = (e: any) => {
    e.preventDefault();

    if (!searchString) {
      alert('검색어를 입력해주세요');
      return;
    }

    setSearchRes({ filterRes: searchFilter, stringRes: searchString, boardRes: boardNow });

    fetch(
      `http://pien.kr:4000/community?page=1&number=10&categoryId=${boardNow}&filter=${searchFilter}&search=${searchString}`,
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
        setIsItSearching(true);
      });
  };

  const pagination = (number: number | undefined) => {
    const temp = number ? Math.ceil(number / 10) : undefined;
    const arr = [];
    if (temp) {
      let arrTemp: number[] = [];
      for (let i = 1; i <= temp; i += 1) {
        arrTemp.push(i);
        if (arrTemp.length === 3) {
          arr.push(arrTemp);
          arrTemp = [];
        }

        if (i === temp && arrTemp.length) arr.push(arrTemp);
      }
    }
    return arr;
  };

  const pages = pagination(postNumber);
  const pageIndex = postPage % 3 ? Math.floor(postPage / 3) : postPage / 3 - 1;

  const goPosting = () => {
    navigate('/community/posting');
  };

  return (
    <OuterBox>
      {isItSearching ? (
        <SearchBar
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
        <button type='button' onClick={goPosting}>
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
          {posts?.length === 0 ? (
            <EmptyPosts>등록된 게시글이 없습니다.</EmptyPosts>
          ) : (
            posts?.map((el, i) => (
              <Post key={el.id}>
                <LabelAndTitle>
                  <Label onClick={() => setBoardNow(el.categoryId)}>
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
                <User
                  onClick={() => {
                    setDropBox(i);
                  }}
                  // ref={(element: never) => {
                  //   if (element) dropBoxRef.current?.push(element);
                  // }}
                >
                  {el.user.nickname}
                  <UserDropBox id={i} dropBox={dropBox}>
                    <ul>
                      <li>프로필보기</li>
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
        </PostList>
      </PostsBox>
      <SearchAndPages>
        <SearchBox>
          <SearchSelect
            ref={searchDropRef}
            isItClicked={searchDropIsOpen}
            onClick={() => setSearchDropIsOpen((current) => !current)}
          >
            {searchFilterNow}
            <img src={searchDropIsOpen ? arrowUp : arrowDown} alt='arrow' />
            <ul>
              <li role='presentation' onClick={(e) => makeSearchFilter(e, 'content')}>
                제목 + 내용
              </li>
              <li role='presentation' onClick={(e) => makeSearchFilter(e, 'nickname')}>
                작성자
              </li>
              <li role='presentation' onClick={(e) => makeSearchFilter(e, 'reply')}>
                댓글내용
              </li>
            </ul>
          </SearchSelect>
          <SearchInputBox>
            <SearchInput placeholder='검색어를 입력해주세요' onKeyUp={makeSearchInput} />
          </SearchInputBox>
          <SearchBtn type='button' onClick={(e) => search(e)}>
            검색
          </SearchBtn>
        </SearchBox>

        <Pages>
          <PageLeft pageIndex={pageIndex} onClick={() => setPostPage((pageIndex - 1) * 3 + 1)}>
            <img src={pageLeft} alt='pageLeft' />
          </PageLeft>

          {pages[pageIndex]?.map((el) => (
            <Page postPage={postPage} id={el} onClick={() => setPostPage(el)}>
              {el}
            </Page>
          ))}
          <PageRight
            pagesLength={pages.length}
            pageIndex={pageIndex}
            onClick={() => setPostPage((pageIndex + 1) * 3 + 1)}
          >
            <img src={pageRight} alt='pageRight' />
          </PageRight>
        </Pages>
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

const SearchAndPages = styled.div`
  display: flex;
  justify-content: end;
`;

const SearchBox = styled.div`
  display: flex;
  margin-top: 30px;
  font-size: 12px;
  margin-right: 70px;
`;
const SearchSelect = styled.div<{ isItClicked: boolean }>`
  display: flex;
  align-items: center;
  width: 120px;
  height: 34px;
  border: 1px solid #e5e5e5;
  border-radius: 0;
  position: relative;
  font-size: 12px;
  font-weight: normal;
  padding: 0 12px;

  &:hover {
    cursor: pointer;
  }

  img {
    width: 13px;
    height: 13px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  ul {
    display: ${(props) => (props.isItClicked ? 'block' : 'none')};
    position: absolute;
    top: 100%;
    left: -1px;
    border: 1px solid #e5e5e5;
  }

  li {
    padding: 0 12px;
    width: 120px;
    height: 36px;
    display: flex;
    align-items: center;

    &:hover {
      cursor: pointer;
      background-color: #feeaa3;
    }
  }
`;
const SearchInputBox = styled.div`
  display: flex;
  border: 1px solid #e5e5e5;
  border-right: none;
  align-items: center;
  width: 199px;
  margin-left: 10px;
`;
const SearchInput = styled.input`
  height: 34px;
  width: 98%;
  padding: 0 12px;
  border: none;
`;
const SearchBtn = styled.button`
  ${(props) => props.theme.variables.flex()}
  width: 56px;
  height: 36px;
  color: black;
  /* font-weight: bold; */
  background-color: ${(props) => props.theme.style.buttonYellow};
  border: none;

  &:hover {
    cursor: pointer;
  }
`;

const Pages = styled.div`
  margin-top: 30px;
  margin-right: 25px;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const PageLeft = styled.div<{ pageIndex: number }>`
  display: ${(props) => (props.pageIndex === 0 ? 'none' : 'flex')};

  img {
    width: 10px;
    height: 10px;

    &:hover {
      cursor: pointer;
    }
  }
`;
const PageRight = styled.div<{ pageIndex: number; pagesLength: number }>`
  display: ${(props) => (props.pageIndex === props.pagesLength - 1 ? 'none' : 'flex')};

  img {
    width: 10px;
    height: 10px;
    margin-left: 30px;

    &:hover {
      cursor: pointer;
    }
  }
`;

const Page = styled.div<{ postPage: number; id: any }>`
  font-weight: ${(props) => (props.postPage === props.id ? 'bold' : 'normal')};
  margin-left: 25px;
  border: ${(props) => (props.postPage === props.id ? '1px solid #e5e5e5' : 'none')};
  padding: 0 5px;
  color: ${(props) => (props.postPage === props.id ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
  }
`;

const SearchResult = styled.div``;
