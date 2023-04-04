import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import user from '../../images/user.png';

type ObjectType = {
  [index: number]: number;
};

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

interface CommentDetail {
  id: number;
  comment: string;
  created_at: string;
  deleted_at: string;
  isItNew: boolean;
  replyId: number;
  isThisOrigin: boolean;
  user: UserDetail;
}

type CommentsBoxProps = {
  commentWindowRef: React.RefObject<HTMLDivElement>;
  replying: number | null;
  setReplying: React.Dispatch<React.SetStateAction<number | null>>;
  commentCount: number;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
};

export default function CommentsBox({
  commentWindowRef,
  replying,
  setReplying,
  commentCount,
  setCommentCount,
  setProfileId,
  setMenuNow,
}: CommentsBoxProps) {
  const [commentData, setCommentData] = useState<CommentDetail[]>();
  const [commentWrite, setCommentWrite] = useState<string>('');
  const [editing, setEditing] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<string>();
  const [replyComment, setReplyComment] = useState<string>();

  const params = useParams();

  const dateParsing = (date: string): [string, boolean] => {
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

  const textarea = useRef<HTMLTextAreaElement>(null);
  const replyTextArea = useRef<HTMLTextAreaElement>(null);
  const editTextArea = useRef<HTMLTextAreaElement>(null);

  const TextAreaHandler = (event: any) => {
    if (textarea.current) {
      textarea.current.style.height = 'auto';
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }

    setCommentWrite(event.target.value);
  };

  const replyTextAreaHandler = (event: any) => {
    if (replyTextArea.current) {
      replyTextArea.current.style.height = 'auto';
      replyTextArea.current.style.height = `${replyTextArea.current.scrollHeight}px`;
    }

    setReplyComment(event.target.value);
  };

  const editTextAreaHandler = (event: any) => {
    if (editTextArea.current) {
      editTextArea.current.style.height = 'auto';
      editTextArea.current.style.height = `${editTextArea.current.scrollHeight}px`;
    }

    setEditingComment(event.target.value);
  };

  useEffect(() => {
    fetch(`http://pien.kr:4000/community/reply/${params.id}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let count = 0;
        const temp = [];

        const obj: ObjectType = {};

        for (let i = 0; i < data.length; i += 1) {
          if (!data[i].deleted_at) {
            if (obj[data[i].replyId]) {
              obj[data[i].replyId] += 1;
            } else {
              obj[data[i].replyId] = 1;
            }
          }
        }

        for (let i = 0; i < data.length; i += 1) {
          if (data[i].replyId === data[i].id) {
            if (data[i].deleted_at && obj[data[i].replyId]) {
              temp.push(data[i]);
            }
          }

          if (!data[i].deleted_at) {
            count += 1;
            temp.push(data[i]);
          }
        }

        setCommentCount(count);
        setCommentData(
          temp.map((el: CommentDetail) => ({
            ...el,
            created_at: dateParsing(el.created_at)[0],
            isItNew: dateParsing(el.created_at)[1],
            isThisOrigin: el.id === el.replyId,
          })),
        );
      });

    setReplying(null);
  }, [params.id]);

  const makeComment = () => {
    if (commentWrite === '') {
      alert('내용을 입력해주세요');
    } else {
      fetch(`http://pien.kr:4000/community/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
        body: JSON.stringify({ postId: params.id, comment: commentWrite }),
      })
        .then((res) => res.json())
        .then((data) => {
          let count = 0;
          const temp = [];

          const obj: ObjectType = {};

          for (let i = 0; i < data.length; i += 1) {
            if (!data[i].deleted_at) {
              if (obj[data[i].replyId]) {
                obj[data[i].replyId] += 1;
              } else {
                obj[data[i].replyId] = 1;
              }
            }
          }

          for (let i = 0; i < data.length; i += 1) {
            if (data[i].replyId === data[i].id) {
              if (data[i].deleted_at && obj[data[i].replyId]) {
                temp.push(data[i]);
              }
            }

            if (!data[i].deleted_at) {
              count += 1;
              temp.push(data[i]);
            }
          }

          setCommentCount(count);
          setCommentData(
            temp.map((el: CommentDetail) => ({
              ...el,
              created_at: dateParsing(el.created_at)[0],
              isItNew: dateParsing(el.created_at)[1],
              isThisOrigin: el.id === el.replyId,
            })),
          );
        });

      setCommentWrite('');
    }
  };

  const editComment = (id: number) => {
    if (editingComment === '') {
      alert('내용을 입력해주세요');
    } else {
      fetch(`http://pien.kr:4000/community/reply/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
        body: JSON.stringify({ comment: editingComment }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setEditing(null);
            fetch(`http://pien.kr:4000/community/reply/${params.id}`, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization:
                  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
              },
            })
              .then((res) => res.json())
              .then((data) => {
                let count = 0;
                const temp = [];

                const obj: ObjectType = {};

                for (let i = 0; i < data.length; i += 1) {
                  if (!data[i].deleted_at) {
                    if (obj[data[i].replyId]) {
                      obj[data[i].replyId] += 1;
                    } else {
                      obj[data[i].replyId] = 1;
                    }
                  }
                }

                for (let i = 0; i < data.length; i += 1) {
                  if (data[i].replyId === data[i].id) {
                    if (data[i].deleted_at && obj[data[i].replyId]) {
                      temp.push(data[i]);
                    }
                  }

                  if (!data[i].deleted_at) {
                    count += 1;
                    temp.push(data[i]);
                  }
                }
                setCommentCount(count);
                setCommentData(
                  temp.map((el: CommentDetail) => ({
                    ...el,
                    created_at: dateParsing(el.created_at)[0],
                    isItNew: dateParsing(el.created_at)[1],
                    isThisOrigin: el.id === el.replyId,
                  })),
                );
              });
          }
        });
    }
  };

  const makeReplyComment = (replyId: number) => {
    if (replyComment === '') {
      alert('내용을 입력해주세요');
    } else {
      fetch(`http://pien.kr:4000/community/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
        body: JSON.stringify({ postId: params.id, comment: replyComment, replyId }),
      })
        .then((res) => res.json())
        .then((data) => {
          let count = 0;
          const temp = [];

          const obj: ObjectType = {};

          for (let i = 0; i < data.length; i += 1) {
            if (!data[i].deleted_at) {
              if (obj[data[i].replyId]) {
                obj[data[i].replyId] += 1;
              } else {
                obj[data[i].replyId] = 1;
              }
            }
          }

          for (let i = 0; i < data.length; i += 1) {
            if (data[i].replyId === data[i].id) {
              if (data[i].deleted_at && obj[data[i].replyId]) {
                temp.push(data[i]);
              }
            }

            if (!data[i].deleted_at) {
              count += 1;
              temp.push(data[i]);
            }
          }

          setCommentCount(count);
          setCommentData(
            temp.map((el: CommentDetail) => ({
              ...el,
              created_at: dateParsing(el.created_at)[0],
              isItNew: dateParsing(el.created_at)[1],
              isThisOrigin: el.id === el.replyId,
            })),
          );
          setReplying(null);
        });

      setReplyComment('');
    }
  };

  const deleteComment = (id: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?') === true) {
      fetch(`http://pien.kr:4000/community/reply`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
        body: JSON.stringify({ replyId: [id] }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === true) {
            fetch(`http://pien.kr:4000/community/reply/${params.id}`, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization:
                  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
              },
            })
              .then((res) => res.json())
              .then((data) => {
                let count = 0;
                const temp = [];

                const obj: ObjectType = {};

                for (let i = 0; i < data.length; i += 1) {
                  if (!data[i].deleted_at) {
                    if (obj[data[i].replyId]) {
                      obj[data[i].replyId] += 1;
                    } else {
                      obj[data[i].replyId] = 1;
                    }
                  }
                }

                for (let i = 0; i < data.length; i += 1) {
                  if (data[i].replyId === data[i].id) {
                    if (data[i].deleted_at && obj[data[i].replyId]) {
                      temp.push(data[i]);
                    }
                  }

                  if (!data[i].deleted_at) {
                    count += 1;
                    temp.push(data[i]);
                  }
                }

                setCommentCount(count);
                setCommentData(
                  temp.map((el: CommentDetail) => ({
                    ...el,
                    created_at: dateParsing(el.created_at)[0],
                    isItNew: dateParsing(el.created_at)[1],
                    isThisOrigin: el.id === el.replyId,
                  })),
                );
              });
          }
        });
    }
    return null;
  };

  return (
    <OuterBox>
      <CommentHeader ref={commentWindowRef}>
        <CommentHeaderBox>
          <CommentHeaderTitle>댓글</CommentHeaderTitle>
          <span>{commentCount}개</span>
          {commentData?.some((el) => el.isItNew) ? <IsItNew>N</IsItNew> : null}
        </CommentHeaderBox>
      </CommentHeader>
      <Comments>
        {commentData?.map((el, i) => (
          <>
            <DeletedOrigin isThisDeleted={el.deleted_at} index={i}>
              삭제된 댓글입니다.
            </DeletedOrigin>
            {editing === el.id ? (
              <ReplyToReplyBox id={el.id} isLastOne={i === commentData.length - 1}>
                <RTRPosting>
                  <NickAndLength>
                    <RTRNick>피엔</RTRNick>
                    {editingComment ? <RTRLength>{editingComment.length}/3000</RTRLength> : null}
                  </NickAndLength>
                  <RTRDescription
                    ref={editTextArea}
                    onInput={editTextAreaHandler}
                    value={editingComment}
                    placeholder='댓글을 남겨보세요'
                  />
                  <RTRBtns>
                    <ButtonsLeft />
                    <ButtonsRight>
                      <CancleWriting
                        onClick={() => {
                          setEditing(null);
                          setEditingComment('');
                        }}
                      >
                        취소
                      </CancleWriting>
                      <PostThisComment
                        isThisValid={editingComment?.length}
                        onClick={() => editComment(el.id)}
                      >
                        수정
                      </PostThisComment>
                    </ButtonsRight>
                  </RTRBtns>
                </RTRPosting>
              </ReplyToReplyBox>
            ) : (
              <Comment index={i} key={el.id} isThisOrigin={el.isThisOrigin} isThisDeleted={el.deleted_at}>
                <UserImg
                  onClick={() => {
                    setProfileId(el.user.id);
                    setMenuNow(2);
                  }}
                >
                  <img src={user} alt='user' />
                </UserImg>
                <CommentTextBox>
                  <CommentUserNick>{el.user.nickname}</CommentUserNick>
                  <CommentDescription>{el.comment}</CommentDescription>
                  <CommentCreatedAt>
                    <span>{el.created_at}</span>
                    <ReplyToReply
                      onClick={() => {
                        setEditing(null);
                        setReplying(el.id);
                        setReplyComment('');
                      }}
                    >
                      답글쓰기
                    </ReplyToReply>
                  </CommentCreatedAt>
                </CommentTextBox>
                <DeleteOrEdit>
                  <Edit
                    onClick={() => {
                      setReplying(null);
                      setEditing(el.id);
                      setEditingComment(el.comment);
                    }}
                    id={el.id}
                  >
                    수정
                  </Edit>
                  <Delete onClick={() => deleteComment(el.id)}>삭제</Delete>
                </DeleteOrEdit>
              </Comment>
            )}
            {replying === el.id ? (
              <ReplyToReplyBox id={el.id} isLastOne={i === commentData.length - 1}>
                <RTRPosting>
                  <NickAndLength>
                    <RTRNick>피엔</RTRNick>
                    {replyComment ? <RTRLength>{replyComment.length}/3000</RTRLength> : null}
                  </NickAndLength>

                  <RTRDescription
                    ref={replyTextArea}
                    placeholder={`${el.user.nickname}님께 답글쓰기`}
                    onInput={replyTextAreaHandler}
                    value={replyComment}
                  />
                  <RTRBtns>
                    <ButtonsLeft />
                    <ButtonsRight>
                      <CancleWriting
                        onClick={() => {
                          setReplying(null);
                          setReplyComment('');
                        }}
                      >
                        취소
                      </CancleWriting>
                      <PostThisComment
                        isThisValid={replyComment?.length}
                        onClick={() => makeReplyComment(el.replyId)}
                      >
                        등록
                      </PostThisComment>
                    </ButtonsRight>
                  </RTRBtns>
                </RTRPosting>
              </ReplyToReplyBox>
            ) : null}
          </>
        ))}
      </Comments>
      <CommentPosting>
        <NickAndLength>
          <CommentPostingNick>피엔</CommentPostingNick>
          {commentWrite ? <RTRLength>{commentWrite.length}/3000</RTRLength> : null}
        </NickAndLength>
        <CommentPostingDesc
          ref={textarea}
          placeholder='댓글을 남겨보세요'
          onInput={TextAreaHandler}
          value={commentWrite}
        />
        <CommentPostingBtns>
          <ButtonsLeft />
          <PostThisComment onClick={makeComment} isThisValid={commentWrite?.length}>
            등록
          </PostThisComment>
        </CommentPostingBtns>
      </CommentPosting>
    </OuterBox>
  );
}

const OuterBox = styled.div``;
const CommentHeader = styled.div`
  padding-top: 16px;
  margin-bottom: 11px;
`;
const CommentHeaderBox = styled.div`
  display: flex;

  span {
    font-size: 13px;
    font-weight: bold;
    color: #b7b7b7;
  }
`;
const CommentHeaderTitle = styled.div`
  font-size: 17px;
  font-weight: bold;
  margin: 0 12px 0 0;
`;

const IsItNew = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 13px;
  height: 13px;
  border-radius: 100%;
  font-size: 10px;
  /* font-weight: bold; */
  background-color: red;
  color: white;
  margin-left: 2px;
`;

const Comments = styled.div``;

const DeletedOrigin = styled.div<{ isThisDeleted: string; index: number }>`
  font-size: 13px;
  display: ${(props) => (props.isThisDeleted ? 'flex' : 'none')};
  border-top: ${(props) => (props.index === 0 ? 'none' : '1px solid #e5e5e5')};
  padding: 15px 0 15px 0;
`;
const Comment = styled.div<{ index: number; isThisOrigin: boolean; isThisDeleted: string }>`
  display: ${(props) => (props.isThisDeleted ? 'none' : 'flex')};
  position: relative;
  padding: 12px 0 10px 0;
  border-top: ${(props) => (props.index === 0 ? 'none' : '1px solid #e5e5e5')};
  padding-left: ${(props) => (props.isThisOrigin ? '0' : '46px')};
`;

const CommentTextBox = styled.div``;
const CommentUserNick = styled.div`
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 6px;

  &:hover {
    cursor: pointer;
  }
`;
const CommentDescription = styled.div`
  font-size: 13px;
`;
const CommentCreatedAt = styled.div`
  font-size: 12px;
  color: #979797;
  margin-top: 7px;
`;
const ReplyToReply = styled.button`
  border: none;
  font-size: 12px;
  font-weight: bold;
  background-color: white;
  margin-left: 8px;
  color: #979797;

  &:hover {
    cursor: pointer;
  }
`;

const DeleteOrEdit = styled.div`
  display: flex;
  position: absolute;
  right: 0;
`;
const Edit = styled.button<{ id: any }>`
  background-color: white;
  border: none;
  color: #979797;
  font-size: 12px;
  font-weight: bold;
  height: 16px;

  &:hover {
    cursor: pointer;
  }
`;
const Delete = styled.button`
  background-color: white;
  border: none;
  color: #979797;
  font-size: 12px;
  font-weight: bold;
  height: 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ReplyToReplyBox = styled.div<{ id: any; isLastOne: any }>`
  flex-direction: column;
  padding: 12px 0;
  border-top: 1px solid #e5e5e5;
  padding-left: 46px;
  border-bottom: ${(props) => (props.isLastOne ? '1px solid #e5e5e5' : 'none')};
`;

const RTRPosting = styled.div`
  border: 2px solid #e5e5e5;
  border-radius: 5px;
  padding: 16px 10px 10px 18px;
  font-size: 13px;
`;

const NickAndLength = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 9px;
`;
const RTRLength = styled.div`
  font-size: 12px;
  color: #979797;
`;

const RTRNick = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const RTRDescription = styled.textarea`
  border: none;
  resize: none;
  width: 100%;
  background-color: white;
  overflow: visible;

  &:focus {
    outline: none;
  }

  ::placeholder {
    color: #e5e5e5;
  }
`;

const RTRBtns = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CommentPosting = styled.div`
  border: 2px solid #e5e5e5;
  border-radius: 5px;
  padding: 16px 10px 10px 18px;
  font-size: 13px;
  margin-top: 10px;
`;

const CommentPostingNick = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const CommentPostingDesc = styled.textarea`
  border: none;
  resize: none;
  width: 100%;
  background-color: white;
  overflow: visible;

  &:focus {
    outline: none;
  }

  ::placeholder {
    color: #e5e5e5;
  }
`;

const CommentPostingBtns = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonsLeft = styled.div``;
const ButtonsRight = styled.div``;

const CancleWriting = styled.button`
  width: 40px;
  padding-right: 0;
  height: 34px;
  border: none;
  font-weight: bold;
  font-size: 13px;
  color: #b7b7b7;
  background-color: white;

  &:hover {
    cursor: pointer;
  }
`;

const PostThisComment = styled.button<{ isThisValid: any }>`
  width: 46px;
  height: 34px;
  border: none;
  font-weight: bold;
  font-size: 13px;
  color: ${(props) => (props.isThisValid > 0 ? 'black' : '#b7b7b7;')};
  background-color: ${(props) => (props.isThisValid > 0 ? '#feeaa3' : 'white')};
  border-radius: 5px;

  &:hover {
    cursor: pointer;
  }
`;

const UserImg = styled.div`
  display: flex;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 100%;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  margin-right: 10px;

  img {
    margin-top: 12px;
    width: 24px;
    height: 24px;
    opacity: 0.2;
  }

  &:hover {
    cursor: pointer;
  }
`;
