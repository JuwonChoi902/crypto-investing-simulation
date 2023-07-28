import React from 'react';
import { HeadersType, CommentDataType, IndexObjectType } from '../typing/types';

export const makeHeader = (loginUserToken: string | null): HeadersType => {
  const headers: HeadersType = {
    'Content-Type': 'application/json;charset=utf-8',
  };

  if (loginUserToken) {
    headers.Authorization = `Bearer ${loginUserToken}`;
  } else {
    delete headers.Authorization;
  }

  return headers;
};

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

export const testModules = {
  makeHeader,
  dateParsing,
  unitParsing,
};
