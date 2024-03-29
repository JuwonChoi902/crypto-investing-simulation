import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import arrowUp from '../../images/arrowUp.png';
import arrowDown from '../../images/arrowDown.png';
import { PostDataType, SearchResType } from '../../../../typing/types';
import { makeHeaders, getPostListData } from '../../../../utils/functions';

type SearchBarProps = {
  setPosts: React.Dispatch<React.SetStateAction<PostDataType[] | undefined>>;
  setPostNumber: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSearchRes: React.Dispatch<React.SetStateAction<SearchResType>>;
  setIsItSearching: React.Dispatch<React.SetStateAction<boolean>>;
  boardNow: number | null;
};

const filters: string[][] = [
  ['제목 + 내용', 'content'],
  ['작성자', 'nickname'],
  ['댓글내용', 'reply'],
];

export default function SearchBarUnder({
  boardNow,
  setPostNumber,
  setSearchRes,
  setPosts,
  setIsItSearching,
}: SearchBarProps) {
  const [searchDropIsOpen, setSearchDropIsOpen] = useState<boolean>(false);
  const [searchFilterNow, setSearchFilterNow] = useState<string>('제목 + 내용');
  const [searchInput, setSearchInput] = useState({
    searchFilter: 'content',
    searchString: '',
  });

  const { searchFilter, searchString } = searchInput;
  const searchDropRef = useRef<HTMLDivElement>(null);
  const loginUserToken = localStorage.getItem('accessToken');
  const memoizedMakeHeaders = useCallback(makeHeaders, []);
  const memoizedGetList = useCallback(getPostListData, []);

  useEffect(() => {
    if (searchFilter === 'content') setSearchFilterNow('제목 + 내용');
    if (searchFilter === 'nickname') setSearchFilterNow('작성자');
    if (searchFilter === 'reply') setSearchFilterNow('댓글내용');
  }, [searchFilter]);

  const makeSearchFilter = (str: string) => {
    setSearchInput({ ...searchInput, searchFilter: str });
  };

  useEffect(() => {
    const changeDropState = (e: CustomEvent<MouseEvent>) => {
      if (searchDropRef.current && !searchDropRef.current?.contains(e.target as Node)) {
        setSearchDropIsOpen((cur) => !cur);
      }
    };

    if (searchDropIsOpen) {
      window.addEventListener('click', changeDropState as EventListener);
    }

    return () => {
      window.removeEventListener('click', changeDropState as EventListener);
    };
  }, [searchDropIsOpen]);

  const search = () => {
    const headers = memoizedMakeHeaders(loginUserToken);

    if (!searchString) {
      alert('검색어를 입력해주세요');
      return;
    }
    setSearchRes({ filterRes: searchFilter, stringRes: searchString, boardRes: boardNow });

    memoizedGetList(
      true,
      1,
      boardNow,
      boardNow,
      searchFilter,
      searchString,
      headers,
      setPostNumber,
      setPosts,
    );
    setIsItSearching(true);
  };

  const makeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput({ ...searchInput, searchString: event.target.value });
  };

  return (
    <OuterBox data-testid='searchbarunder-component'>
      <SearchSelect
        data-testid='selectBox'
        ref={searchDropRef}
        isItClicked={searchDropIsOpen}
        onClick={() => setSearchDropIsOpen((current) => !current)}
      >
        {searchFilterNow}
        <img src={searchDropIsOpen ? arrowUp : arrowDown} alt='arrow' />
        <ul data-testid='dropbox'>
          {filters.map((el) => (
            <li role='presentation' onClick={() => makeSearchFilter(el[1])} key={el[0]}>
              {el[0]}
            </li>
          ))}
        </ul>
      </SearchSelect>
      <SearchInputBox>
        <SearchInput
          data-testid='inputBox'
          placeholder='검색어를 입력해주세요'
          onChange={makeSearchInput}
          onKeyDown={(e) => (e.key === 'Enter' ? search() : null)}
        />
      </SearchInputBox>
      <SearchBtn type='button' onClick={() => search()}>
        검색
      </SearchBtn>
    </OuterBox>
  );
}

const OuterBox = styled.div`
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
