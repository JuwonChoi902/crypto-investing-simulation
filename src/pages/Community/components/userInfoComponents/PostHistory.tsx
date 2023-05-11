import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Pages from '../otherComponents/Pages';
import { HeadersType, PostDataType } from '../../../../typing/types';

type PostHistoryProps = {
  profileId: number | null | undefined;
};

export default function PostHistory({ profileId }: PostHistoryProps) {
  const [checked, setChecked] = useState<number[]>([]);
  const [postsData, setPostsData] = useState<PostDataType[]>([]);
  const [postNumber, setPostNumber] = useState<number>();
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

    fetch(`https://server.pien.kr:4000/community/post/user/${profileId}?page=${page}&number=15`, {
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
    if (checked.includes(Number(event.target.id))) {
      const temp = checked.filter((el) => el !== Number(event.target.id));
      setChecked(temp);
    } else {
      setChecked([...checked, Number(event.target.id)]);
    }
  };

  const checkAll = () => {
    if (checked.length !== postsData.length) {
      const temp: number[] = [];
      postsData.forEach((el) => {
        temp.push(el.id);
      });
      setChecked(temp);
    } else {
      setChecked([]);
    }
  };

  const deleteChecked = () => {
    if (!loginUserToken) {
      if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
        navigate('/login');
      }
    } else if (window.confirm('선택된 게시글을 삭제하시겠습니까?') === true) {
      const headers: HeadersType = {
        'Content-Type': 'application/json;charset=utf-8',
      };

      if (loginUserToken) {
        headers.Authorization = `Bearer ${loginUserToken}`;
      } else {
        delete headers.Authorization;
      }

      fetch(`https://server.pien.kr:4000/community/post`, {
        method: 'DELETE',
        headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
        body: JSON.stringify({ postId: checked }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            fetch(`https://server.pien.kr:4000/community/post/user/${profileId}?page=${page}&number=15`, {
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
                  setChecked([]);
                }
              });
          } else {
            alert(data.message);
            navigate('/community/list');
          }
        });
    }
    return null;
  };

  return (
    <OuterBox>
      <ListCategories>
        <LCTitle>제목</LCTitle>
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
                      checked={checked.includes(post.id)}
                      onChange={(event) => checkedChange(event)}
                      readOnly
                    />
                  </CheckBox>
                ) : null}
                <PostId>{post.id}</PostId>
                <PostTitle
                  onClick={() => {
                    navigate(`/community/${post.id}`);
                  }}
                >
                  {post.title}
                  <ReplyAndNew>
                    {post.repliesCount === 0 ? null : <RepliesCount>[{post.repliesCount}]</RepliesCount>}
                    {post.created_at[1] ? <IsItNew>N</IsItNew> : null}
                  </ReplyAndNew>
                </PostTitle>
              </PostTitleBox>
              <PostDate>{post.created_at}</PostDate>
              <PostHit>{post.hits}</PostHit>
            </Post>
          ))}
        </List>
      ) : (
        <EmptyList>작성한 게시글이 없습니다.</EmptyList>
      )}
      <ButtonAndPageBox>
        <SelectAll>
          {profileId === loginUserId && postNumber !== 0 ? (
            <CheckAll onChange={checkAll}>
              <input type='checkBox' checked={checked.length === postsData.length} readOnly />
              <div>전체선택</div>
            </CheckAll>
          ) : null}
        </SelectAll>
        <Pages setPage={setPage} page={page} postNumber={postNumber} limit={15} />
        <DeleteAndWrite>
          {profileId === loginUserId ? <DeleteBtn onClick={deleteChecked}>삭제</DeleteBtn> : null}
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
      </ButtonAndPageBox>
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
`;
const LCTitle = styled.div`
  ${(props) => props.theme.variables.flex()};

  width: 660px;
  height: 45px;
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
const PostTitle = styled.div`
  ${(props) => props.theme.variables.flex()}
  font-size: 13px;

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
const ButtonAndPageBox = styled.div`
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
  white-space: nowrap;

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
`;
const DeleteBtn = styled.button`
  background-color: #eff0f2;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 14px;
  white-space: nowrap;
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
  white-space: nowrap;
  &:hover {
    cursor: pointer;
  }
`;
