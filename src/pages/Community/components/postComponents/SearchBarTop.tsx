import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import arrowUp from '../../images/arrowUp.png';
import arrowDown from '../../images/arrowDown.png';

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

interface SearchInput {
  searchFilter: string;
  searchString: string;
  searchBoard: number | null;
}

type SearchBarProps = {
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  setPosts: React.Dispatch<React.SetStateAction<PostDetail[] | undefined>>;
  setPostNumber: React.Dispatch<React.SetStateAction<number | undefined>>;
  searchRes: SearchRes;
  setSearchRes: React.Dispatch<React.SetStateAction<SearchRes>>;
};

const boards: string[] = ['전체글', '질문하기', '자랑하기', '공유하기', '잡담하기'];
const filters: string[][] = [
  ['제목 + 내용', 'contents'],
  ['작성자', 'nickname'],
  ['댓글내용', 'reply'],
];

export default function SearchBarTop({
  setPostNumber,
  setPosts,
  searchRes,
  setSearchRes,
  setBoardNow,
}: SearchBarProps) {
  const searchDropRef = useRef<HTMLDivElement>(null);
  const boardsDropRef = useRef<HTMLDivElement>(null);

  const [searchFilterNow, setSearchFilterNow] = useState<string>('제목 + 내용');
  const [searchInput, setSearchInput] = useState<SearchInput>({
    searchFilter: '',
    searchString: '',
    searchBoard: 0,
  });
  const [searchDropIsOpen, setSearchDropIsOpen] = useState<boolean>(false);
  const [boardsDropIsOpen, setBoardDropIsOpen] = useState<boolean>(false);
  const { searchFilter, searchString, searchBoard } = searchInput;

  const makeSearchInput = (event: any) => {
    if (event.key === 'Enter') search(event);
    setSearchInput({ ...searchInput, searchString: event.target.value });
  };

  const makeSearchFilter = (event: any, str: string) => {
    setSearchInput({ ...searchInput, searchFilter: str });
  };

  const makeBoardFilter = (event: any, index: number) => {
    setSearchInput({ ...searchInput, searchBoard: index });
  };

  useEffect(() => {
    if (searchFilter === 'content') setSearchFilterNow('제목 + 내용');
    if (searchFilter === 'nickname') setSearchFilterNow('작성자');
    if (searchFilter === 'reply') setSearchFilterNow('댓글내용');
  }, [searchFilter]);

  useEffect(() => {
    setSearchInput({
      searchFilter: searchRes.filterRes,
      searchString: searchRes.stringRes,
      searchBoard: searchRes.boardRes,
    });
  }, [searchRes]);

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

  useEffect(() => {
    const changeDropState = (e: any) => {
      if (boardsDropRef.current !== null && !boardsDropRef.current?.contains(e.target)) {
        setBoardDropIsOpen((cur) => !cur);
      }
    };

    if (boardsDropIsOpen) {
      window.addEventListener('click', changeDropState);
    }

    return () => {
      window.removeEventListener('click', changeDropState);
    };
  }, [boardsDropIsOpen]);

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

  const search = (e: any) => {
    e.preventDefault();
    if (!searchString) {
      alert('검색어를 입력해주세요');
      return;
    }
    fetch(
      `http://pien.kr:4000/community?page=1&number=10&categoryId=${searchBoard}&filter=${searchFilter}&search=${searchString}`,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setBoardNow(searchBoard);
        setSearchRes({ stringRes: searchString, filterRes: searchFilter, boardRes: searchBoard });
        setPostNumber(data.number);
        setPosts(data.post.map((el: PostDetail) => ({ ...el, created_at: dateParsing(el.created_at) })));
      });
  };

  return (
    <OuterBox>
      <SearchBox>
        <BoardSelect
          ref={boardsDropRef}
          isItClicked={boardsDropIsOpen}
          onClick={() => setBoardDropIsOpen((current) => !current)}
        >
          {searchBoard ? boards[searchBoard] : '전체글'}
          <img src={boardsDropIsOpen ? arrowUp : arrowDown} alt='arrow' />
          <ul>
            {boards.map((el, i) => (
              <li role='presentation' onClick={(e) => makeBoardFilter(e, i)} key={el}>
                {el}
              </li>
            ))}
          </ul>
        </BoardSelect>
        <SearchSelect
          ref={searchDropRef}
          isItClicked={searchDropIsOpen}
          onClick={() => setSearchDropIsOpen((current) => !current)}
        >
          {searchFilterNow}
          <img src={searchDropIsOpen ? arrowUp : arrowDown} alt='arrow' />
          <ul>
            {filters.map((el) => (
              <li role='presentation' onClick={(e) => makeSearchFilter(e, el[1])} key={el[0]}>
                {el[0]}
              </li>
            ))}
          </ul>
        </SearchSelect>
        <SearchInputBox>
          <SearchInput
            placeholder='검색어를 입력해주세요'
            onChange={makeSearchInput}
            onKeyDown={(e) => (e.key === 'Enter' ? search(e) : null)}
            value={searchString}
          />
        </SearchInputBox>
        <SearchBtn type='button' onClick={search}>
          검색
        </SearchBtn>
      </SearchBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchBox = styled.div`
  display: flex;
  margin-bottom: 30px;
  font-size: 12px;
  margin-right: 70px;
`;

const BoardSelect = styled.div<{ isItClicked: boolean }>`
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
  z-index: 1;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
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
    z-index: 1;
    background-color: white;
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
  margin-left: 10px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
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
    z-index: 1;
  }

  li {
    padding: 0 12px;
    width: 120px;
    height: 36px;
    display: flex;
    align-items: center;
    background-color: white;

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
