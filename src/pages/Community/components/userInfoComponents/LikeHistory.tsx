import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Pages from '../otherComponents/Pages';
import { HeadersType, PostDataType } from '../../../../typing/types';

type LikeHistoryProps = {
  profileId: number | null | undefined;
};

export default function LikeHistory({ profileId }: LikeHistoryProps) {
  const [postsData, setPostsData] = useState<PostDataType[]>([]);
  const [postNumber, setPostNumber] = useState<number>(0);
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const loginUserToken = localStorage.getItem('accessToken');
  const loginUserId = Number(localStorage.getItem('id'));

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
    const headers: HeadersType = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    if (loginUserToken) {
      headers.Authorization = `Bearer ${loginUserToken}`;
    } else {
      delete headers.Authorization;
    }

    fetch(`https://server.pien.kr:4000/community/like/user/${profileId}?page=${page}&number=15`, {
      headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isSuccess) {
          setPostNumber(data.data.number);
          setPostsData(
            data.data.post.map((el: PostDataType) => ({ ...el, created_at: dateParsing(el.created_at) })),
          );
        } else {
          alert(data.message);
          navigate('/community/list');
        }
      });
  }, [page]);

  const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (checked.includes(event.target.id)) {
      const temp = checked.filter((el) => el !== event.target.id);
      setChecked(temp);
    } else {
      setChecked([...checked, event.target.id]);
    }
  };

  const checkAll = () => {
    if (checked.length !== postsData.length) {
      const temp: string[] = [];
      postsData.forEach((el) => {
        temp.push(String(el.id));
      });
      setChecked(temp);
    } else {
      setChecked([]);
    }
  };

  const deleteLikes = () => {
    if (!loginUserToken) {
      if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
        navigate('login');
      }
    } else {
      const headers: HeadersType = {
        'Content-Type': 'application/json;charset=utf-8',
      };

      if (loginUserToken) {
        headers.Authorization = `Bearer ${loginUserToken}`;
      } else {
        delete headers.Authorization;
      }

      if (window.confirm('선택한 좋아요를 취소하시겠습니까?') === true) {
        fetch(`https://server.pien.kr:4000/community/like`, {
          method: 'DELETE',
          headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
          body: JSON.stringify({ postId: checked.map((str) => Number(str)) }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.isSuccess) {
              fetch(`https://server.pien.kr:4000/community/like/user/${profileId}?page=${page}&number=15`, {
                headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.isSuccess) {
                    setPostNumber(data.data.number);
                    setPostsData(
                      data.data.post.map((el: PostDataType) => ({
                        ...el,
                        created_at: dateParsing(el.created_at),
                      })),
                    );
                  } else {
                    alert(data.message);
                    navigate('/community/list');
                  }
                });
            } else alert(data.message);
          });
      }
    }
  };

  return (
    <OuterBox>
      <ListCategories>
        <LCTitle>제목</LCTitle>
        <LCNick>작성자</LCNick>
        <LCDate>작성일</LCDate>
        <LCHit>조회</LCHit>
      </ListCategories>
      {postsData.length ? (
        <List>
          {postsData.map((post) => (
            <Post key={post.id}>
              <PostTitleBox>
                {profileId === loginUserId ? (
                  <CheckBox>
                    <input
                      type='checkBox'
                      id={String(post.id)}
                      checked={checked.includes(String(post.id))}
                      onChange={(event) => checkedChange(event)}
                      readOnly
                    />
                  </CheckBox>
                ) : null}
                <PostId>{post.id}</PostId>
                <PostTitle
                  isPublished={post.isPublished}
                  onClick={() => (post.isPublished ? navigate(`/community/${post.id}`) : null)}
                >
                  {post.isPublished ? post.title : <span>삭제된 게시물입니다.</span>}
                  <ReplyAndNew>
                    {post.repliesCount === 0 ? null : <RepliesCount>[{post.repliesCount}]</RepliesCount>}
                    {post.created_at[1] ? <IsItNew>N</IsItNew> : null}
                  </ReplyAndNew>
                </PostTitle>
              </PostTitleBox>
              <PostNick>{post.user.nickname}</PostNick>
              <PostDate>{post.created_at}</PostDate>
              <PostHit>{post.hits}</PostHit>
            </Post>
          ))}
        </List>
      ) : (
        <EmptyList>좋아요한 게시글이 없습니다.</EmptyList>
      )}
      <ButtonBox>
        <SelectAll>
          {profileId === loginUserId && postNumber !== 0 ? (
            <CheckAll onClick={checkAll}>
              <input type='checkBox' checked={checked.length === postsData.length} readOnly />
              <div>전체선택</div>
            </CheckAll>
          ) : null}
        </SelectAll>
        <Pages page={page} setPage={setPage} postNumber={postNumber} limit={15} />
        <DeleteAndWrite>
          {profileId === loginUserId ? <DeleteBtn onClick={deleteLikes}>좋아요 취소</DeleteBtn> : null}
          <WriteBtn
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
            글쓰기
          </WriteBtn>
        </DeleteAndWrite>
      </ButtonBox>
    </OuterBox>
  );
}

const OuterBox = styled.div``;
const ListCategories = styled.div`
  display: flex;
  width: 860px;
  font-size: 13px;
  font-weight: bold;
  border-top: 1px solid black;
  border-bottom: 1px solid #e5e5e5;
  white-space: nowrap;
`;
const LCTitle = styled.div`
  ${(props) => props.theme.variables.flex()};
  padding-left: 30px;
  width: 630px;
  height: 45px;
`;

const LCNick = styled.div`
  ${(props) => props.theme.variables.flex()};

  width: 122px;
  padding: 2px 7px;
  font-weight: bold;
`;

const LCDate = styled.div`
  ${(props) => props.theme.variables.flex()}
  width:120px;
  height: 45px;
`;
const LCHit = styled.div`
  ${(props) => props.theme.variables.flex()}
  width:80px;
  height: 45px;
`;

const List = styled.div``;
const Post = styled.div`
  display: flex;
  width: 860px;
  height: 37px;
  border-bottom: 1px solid #e5e5e5;
`;
const PostTitleBox = styled.div`
  width: 660px;
  display: flex;
`;

const CheckBox = styled.div`
  ${(props) => props.theme.variables.flex()}
  min-width: 30px;
  input {
    width: 14px;
    height: 14px;
    border: #e5e5e5;

    &:hover {
      cursor: pointer;
    }
  }
`;
const PostId = styled.div`
  ${(props) => props.theme.variables.flex()}
  color:#878787;
  min-width: 69px;
  font-size: 11px;
  margin-right: 6px;
`;
const PostTitle = styled.div<{ isPublished: boolean | undefined }>`
  ${(props) => props.theme.variables.flex()}
  font-size: 13px;

  span {
    font-style: italic;
    color: #878787;
  }

  &:hover {
    cursor: ${(props) => (props.isPublished ? 'pointer' : null)};
    text-decoration: underline;
  }
`;

const ReplyAndNew = styled.div`
  display: flex;
`;

const PostNick = styled.div`
  ${(props) => props.theme.variables.flex()}

  font-size: 13px;
  width: 122px;
  padding: 2px 7px;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
  }
`;

const RepliesCount = styled.div`
  font-weight: bold;
  margin-left: 5px;
  color: ${(props) => props.theme.style.red};
  white-space: nowrap;
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

const PostDate = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 120px;
  font-size: 12px;
  white-space: nowrap;
`;
const PostHit = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 80px;
  font-size: 12px;
  white-space: nowrap;
`;

const EmptyList = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 860px;
  height: 37px;
  font-size: 13px;
  border-bottom: 1px solid #e5e5e5;
`;
const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  height: 34px;
  margin: 10px 0px 34px 0px;
`;
const SelectAll = styled.div`
  ${(props) => props.theme.variables.flex()}
`;

const CheckAll = styled.div`
  ${(props) => props.theme.variables.flex()}
  display: flex;
  font-size: 13px;

  input {
    width: 14px;
    height: 14px;
    margin-left: 8px;
    margin-right: 12px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const DeleteAndWrite = styled.div`
  display: flex;
  white-space: nowrap;
`;

const DeleteBtn = styled.button`
  background-color: #eff0f2;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 14px;
  &:hover {
    cursor: pointer;
  }
`;

const WriteBtn = styled.button`
  border: none;
  background-color: #eff0f2;
  margin-left: 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 14px;
  &:hover {
    cursor: pointer;
  }
`;
