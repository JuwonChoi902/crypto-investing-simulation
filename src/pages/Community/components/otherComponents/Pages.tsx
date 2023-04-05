import React from 'react';
import styled from 'styled-components';
import pageLeft from '../../images/pageLeft.png';
import pageRight from '../../images/pageRight.png';

type PagesProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  postNumber: number | undefined;
  limit: number;
};

export default function Pages({ page, setPage, postNumber, limit }: PagesProps) {
  const pagination = (number: number | undefined) => {
    const temp = number ? Math.ceil(number / limit) : undefined;
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
  const pageIndex = page % 3 ? Math.floor(page / 3) : page / 3 - 1;

  return (
    <OuterBox>
      <PageLeft pageIndex={pageIndex} onClick={() => setPage((pageIndex - 1) * 3 + 1)}>
        <img src={pageLeft} alt='pageLeft' />
      </PageLeft>
      {pages[pageIndex]?.map((el) => (
        <Page page={page} id={el} onClick={() => setPage(el)}>
          {el}
        </Page>
      ))}
      <PageRight
        pagesLength={pages.length}
        pageIndex={pageIndex}
        onClick={() => setPage((pageIndex + 1) * 3 + 1)}
      >
        <img src={pageRight} alt='pageRight' />
      </PageRight>
    </OuterBox>
  );
}

const OuterBox = styled.div`
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

const Page = styled.div<{ page: number; id: any }>`
  font-weight: ${(props) => (props.page === props.id ? 'bold' : 'normal')};
  margin-left: 25px;
  border: ${(props) => (props.page === props.id ? '1px solid #e5e5e5' : 'none')};
  padding: 0 5px;
  color: ${(props) => (props.page === props.id ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
  }
`;
