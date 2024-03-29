import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Pages from '../otherComponents/Pages';
import { HeadersType, CommentDataType } from '../../../../typing/types';

type CommentHistoryProps = {
  profileId: number | null | undefined;
};

export default function CommentHistory({ profileId }: CommentHistoryProps) {
  const [comments, setComments] = useState<CommentDataType[]>();
  const [checked, setChecked] = useState<number[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();
  const loginUserToken = localStorage.getItem('accessToken');
  const loginUserId = Number(localStorage.getItem('id'));

  const dateParsing = (date: string): [string, boolean] => {
    const theDate = new Date(date);
    const todayDate = new Date();
    const oneDayPlus = new Date(date);
    oneDayPlus.setDate(oneDayPlus.getDate() + 1);

    const isItInOneDay = oneDayPlus >= todayDate;

    return [
      `${theDate.getFullYear()}.${String(theDate.getMonth() + 1).padStart(2, '0')}.${String(
        theDate.getDate(),
      ).padStart(2, '0')}. `,
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

    fetch(`https://server.pien.kr:4000/community/reply/user/${profileId}?page=${page}&number=15`, {
      headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isSuccess) {
          setCommentCount(data.data.number);
          setComments(
            data.data.replies.map((el: CommentDataType) => ({
              ...el,
              created_at: dateParsing(el.created_at)[0],
              isItNew: dateParsing(el.created_at)[1],
              post: {
                ...el.post,
                title:
                  String(el.post?.title).length > 40 ? `${el.post?.title.slice(0, 40)}...` : el.post?.title,
              },
            })),
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
    if (checked.length !== comments?.length) {
      const temp: number[] = [];
      comments?.forEach((el) => {
        temp.push(el.id);
      });
      setChecked(temp);
    } else {
      setChecked([]);
    }
  };

  const deleteComment = () => {
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

      if (window.confirm('댓글을 삭제하시겠습니까?') === true) {
        fetch(`https://server.pien.kr:4000/community/reply/`, {
          method: 'DELETE',
          headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
          body: JSON.stringify({ replyId: checked }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.isSuccess) {
              fetch(`https://server.pien.kr:4000/community/reply/user/1?page=${page}&number=10`, {
                headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.isSuccess) {
                    setCommentCount(data.data.number);
                    setComments(
                      data.data.replies.map((el: CommentDataType) => ({
                        ...el,
                        created_at: dateParsing(el.created_at)[0],
                        isItNew: dateParsing(el.created_at)[1],
                        post: {
                          ...el.post,
                          title:
                            String(el.post?.title).length > 40
                              ? `${el.post?.title.slice(0, 40)}...`
                              : el.post?.title,
                        },
                      })),
                    );
                    setChecked([]);
                  } else {
                    alert(data.message);
                    navigate('/community/list');
                  }
                });
            }
          });
      }
    }
    return null;
  };

  return (
    <OuterBox>
      {commentCount > 0 ? (
        <CommentCount>
          <div>{commentCount}</div>개의 작성한 댓글이 있습니다.
        </CommentCount>
      ) : (
        <CommentCount>작성한 댓글이 없습니다.</CommentCount>
      )}
      <List>
        {comments?.map((el) => (
          <CommentBox key={el.id}>
            <CommentInner>
              {profileId === loginUserId ? (
                <CheckBox>
                  <input
                    type='checkBox'
                    id={String(el.id)}
                    checked={checked.includes(el.id)}
                    onChange={(event) => checkedChange(event)}
                    readOnly
                  />
                </CheckBox>
              ) : null}
              <Comment
                onClick={() => (el.post?.isPublished ? navigate(`/community/${el.post.id}`) : null)}
                isPublished={el.post?.isPublished}
              >
                <CommentDesc>
                  {el.comment}
                  {el.isItNew ? (
                    <ReplyAndNew>
                      <IsItNew>N</IsItNew>
                    </ReplyAndNew>
                  ) : null}
                </CommentDesc>
                <CommentDate>{el.created_at}</CommentDate>
                <PostTitle>
                  {el.post?.isPublished ? el.post.title : <span>삭제된 게시글</span>}
                  <PostCommentCnt>{`[${el.post?.repliesCount}]`}</PostCommentCnt>
                </PostTitle>
              </Comment>
            </CommentInner>
          </CommentBox>
        ))}
      </List>
      <ButtonBox>
        <SelectAll>
          {profileId === loginUserId && commentCount !== 0 ? (
            <CheckAll onClick={checkAll}>
              <input type='checkBox' checked={checked.length === comments?.length} readOnly />
              <div>전체선택</div>
            </CheckAll>
          ) : null}
        </SelectAll>
        <Pages page={page} setPage={setPage} postNumber={commentCount} limit={10} />
        <DeleteAndWrite>
          {profileId === loginUserId ? <DeleteBtn onClick={deleteComment}>삭제</DeleteBtn> : null}
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
const CommentCount = styled.div`
  display: flex;
  align-items: center;
  width: 860px;
  height: 45px;
  font-size: 13px;
  border-top: 1px solid black;
  border-bottom: 1px solid #e5e5e5;
  white-space: nowrap;
  div {
    font-weight: bold;
  }
`;

const List = styled.div``;
const CommentBox = styled.div`
  width: 860px;
  border-bottom: 1px solid #e5e5e5;
`;
const CommentInner = styled.div`
  display: flex;
  width: 740px;
  padding: 15px 20px 15px 8px;
  font-size: 13px;
  border-bottom: 1px solid #e5e5e5;
`;

const CheckBox = styled.div`
  padding-right: 10px;
  min-width: 21px;
  input {
    width: 14px;
    height: 14px;
  }
`;
const Comment = styled.div<{ isPublished: boolean | undefined }>`
  &:hover {
    cursor: ${(props) => (props.isPublished ? 'pointer' : null)};
    text-decoration: underline;
  }
`;

const CommentDesc = styled.div`
  display: flex;
  max-width: 600px;
  word-break: break-all;
`;

const ReplyAndNew = styled.div`
  display: flex;
  align-items: center;
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

const CommentDate = styled.div`
  color: #878787;
  margin-top: 3px;
`;

const PostTitle = styled.div`
  display: flex;
  color: #878787;
  margin-top: 6px;
  overflow: hidden;
  text-overflow: ellipsis;

  span {
    font-style: italic;
  }
`;

const PostCommentCnt = styled.div`
  margin-left: 4px;
  font-weight: bold;
  color: ${(props) => props.theme.style.red};
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
