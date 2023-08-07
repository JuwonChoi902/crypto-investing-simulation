import React from 'react';
import {
  HeadersType,
  CommentDataType,
  IndexObjectType,
  PostDataType,
  CoinTypes,
  SymbolTickerTypes,
} from '../typing/types';

export const dateParsing = (date: string): [string, boolean] => {
  const theDate = new Date(date);
  const todayDate = new Date();
  const oneDayPlus = new Date(date);
  oneDayPlus.setDate(oneDayPlus.getDate() + 1);
  const isItInOneDay = oneDayPlus >= todayDate;
  return [
    `${theDate.getFullYear()}.${String(theDate.getMonth() + 1).padStart(2, '0')}.${String(
      theDate.getDate(),
    ).padStart(2, '0')}. ${String(theDate.getHours()).padStart(2, '0')}:${String(
      theDate.getMinutes(),
    ).padStart(2, '0')}`,
    isItInOneDay,
  ];
};

export const dateParsingForList = (date: string): [string, boolean] => {
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

export const unitParsing = (num: string) => {
  const temp = Number(num);
  let [divideNum, resString, fractionDigit] = [1, '', 2];
  if (temp >= 1000000000) {
    [divideNum, resString] = [1000000000, 'B'];
  } else if (temp < 1000000000 && temp >= 1000000) {
    [divideNum, resString] = [1000000, 'M'];
  } else if (temp < 1000000 && temp >= 1000) {
    [divideNum, resString] = [1000, 'K'];
  } else fractionDigit = 4;

  return `${(temp / divideNum).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigit,
  })}${resString}`;
};

export const handleCommentsData = (
  data: CommentDataType[],
  setCommentCount: React.Dispatch<React.SetStateAction<number>>,
  setCountAll: React.Dispatch<React.SetStateAction<number>>,
  memoizedDateParsing: (dateString: string) => [string, boolean],
): CommentDataType[] => {
  let commentCount = 0;
  const tempComments: CommentDataType[] = [];
  const replyIdTable: IndexObjectType = {};

  data.forEach((comment: CommentDataType) => {
    if (!comment.deleted_at) {
      if (replyIdTable[comment.replyId]) {
        replyIdTable[comment.replyId] += 1;
      } else {
        replyIdTable[comment.replyId] = 1;
      }
    }
  });

  data.forEach((comment: CommentDataType) => {
    if (comment.replyId === comment.id) {
      if (comment.deleted_at && replyIdTable[comment.replyId]) {
        tempComments.push(comment);
      }
    }

    if (!comment.deleted_at) {
      commentCount += 1;
      tempComments.push(comment);
    }
  });
  setCountAll(data.length);
  setCommentCount(commentCount);

  return tempComments.map((el: CommentDataType) => ({
    ...el,
    created_at: memoizedDateParsing(el.created_at)[0],
    isItNew: memoizedDateParsing(el.created_at)[1],
    isThisOrigin: el.id === el.replyId,
  }));
};

export const makeHeaders = (loginUserToken: string | null): HeadersType => {
  const tempHeaders: HeadersType = {
    'Content-Type': 'application/json;charset=utf-8',
  };

  if (loginUserToken) {
    tempHeaders.Authorization = `Bearer ${loginUserToken}`;
  } else {
    delete tempHeaders.Authorization;
  }

  return tempHeaders;
};

export const getPostListData = (
  isItSearching: boolean,
  page: number,
  boardNow: number | null,
  boardRes: number | null,
  searchFilter: string | undefined,
  searchString: string | undefined,
  headers: HeadersType,
  setPostNumber: React.Dispatch<React.SetStateAction<number | undefined>>,
  setPosts: React.Dispatch<React.SetStateAction<PostDataType[] | undefined>>,
) => {
  const url = isItSearching ? `&filter=${searchFilter}&search=${searchString}` : '';

  fetch(
    `https://server.pien.kr:4000/community?page=${page}&number=10&categoryId=${
      isItSearching ? boardRes : boardNow
    }${url}`,
    {
      headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
    },
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.isSuccess) {
        setPostNumber(data.data.number);
        setPosts(
          data.data.post.map((el: PostDataType) => ({
            ...el,
            created_at: dateParsingForList(el.created_at),
          })),
        );
      }
    });
};

export const getPostData = (
  method: string,
  postId: string | undefined,
  headers: HeadersType,
  likeType: boolean | undefined,
  setPostData: React.Dispatch<React.SetStateAction<PostDataType | undefined>>,
) => {
  const url = method === 'GET' ? '' : '/like';
  const fetchObj = {
    method,
    headers: Object.entries(headers).map(([key, value]) => [key, value || '']) as [string, string][],
    body: method === 'GET' ? undefined : JSON.stringify({ isLike: likeType }),
  };
  fetch(`https://server.pien.kr:4000/community${url}/${postId}`, fetchObj)
    .then((res) => res.json())
    .then((data) => {
      if (data.isSuccess) {
        setPostData({ ...data.data, created_at: dateParsing(data.data.created_at)[0] });
      } else {
        alert(data.message);
      }
    });
};

export const updateTickerData = (
  index: number,
  data: SymbolTickerTypes,
  setTickers: React.Dispatch<React.SetStateAction<CoinTypes[]>>,
  setPriceColor: React.Dispatch<React.SetStateAction<string[]>>,
  priceRef: React.RefObject<number[]>,
) => {
  setTickers((prevTickers) => {
    const updatedTickers = [...prevTickers];
    const prevPrice = priceRef.current?.[index];
    const currentPrice = Number(data.c);
    const copiedPriceRef = priceRef;

    if (prevPrice !== undefined) {
      setPriceColor((prevColors) => {
        const colors = [...prevColors];
        if (currentPrice > prevPrice) {
          colors[index] = 'green';
        } else if (currentPrice < prevPrice) {
          colors[index] = 'red';
        } else {
          colors[index] = 'black';
        }
        return colors;
      });
    }
    if (copiedPriceRef.current) copiedPriceRef.current[index] = currentPrice;

    updatedTickers[index] = {
      ...updatedTickers[index],
      price: unitParsing(data.c),
      dayChange: Number(data.P) > 0 ? `+${Number(data.P).toFixed(2)}` : `${Number(data.P).toFixed(2)}%`,
      volume: unitParsing(data.q),
      volumeOrigin: data.q,
      marketCap: unitParsing(String(Number(data.c) * updatedTickers[index].quantity)),
    };

    return updatedTickers;
  });
};

export const testModules = {
  makeHeaders,
  dateParsing,
  dateParsingForList,
  unitParsing,
  handleCommentsData,
  getPostListData,
  getPostData,
};
