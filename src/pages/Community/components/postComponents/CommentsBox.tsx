import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import user from '../../images/user.png';
import { HeadersType, CommentDataType, IndexObjectType } from '../../../../typing/types';

type CommentsBoxProps = {
  commentWindowRef: React.RefObject<HTMLDivElement>;
  replying: number | null;
  setReplying: React.Dispatch<React.SetStateAction<number | null>>;
  commentCount: number;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | undefined | null>>;
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
  const [commentData, setCommentData] = useState<CommentDataType[]>();
  const [commentWrite, setCommentWrite] = useState<string>('');
  const [editing, setEditing] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<string>();
  const [replyComment, setReplyComment] = useState<string>();
  const [dropBox, setDropBox] = useState<number | null>(null);
  const [countAll, setCountAll] = useState<number>(0);

  const loginUserNick = localStorage.getItem('nickname');
  const loginUserToken = localStorage.getItem('accessToken');
  const loginUserId = Number(localStorage.getItem('id'));
  const params = useParams();
  const navigate = useNavigate();

  const dropBoxRefs = useRef<Array<React.RefObject<HTMLDivElement> | undefined>>();
  const nickBoxRefs = useRef<Array<React.RefObject<HTMLDivElement> | undefined>>();

  useEffect(() => {
    dropBoxRefs.current = Array.from({ length: countAll }, () => React.createRef<HTMLDivElement>());
    nickBoxRefs.current = Array.from({ length: countAll }, () => React.createRef<HTMLDivElement>());
  }, [countAll]);

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

  const TextAreaHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textarea.current) {
      textarea.current.style.height = 'auto';
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }

    setCommentWrite(event.target.value);
  };

  const replyTextAreaHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (replyTextArea.current) {
      replyTextArea.current.style.height = 'auto';
      replyTextArea.current.style.height = `${replyTextArea.current.scrollHeight}px`;
    }

    setReplyComment(event.target.value);
  };

  const editTextAreaHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editTextArea.current) {
      editTextArea.current.style.height = 'auto';
      editTextArea.current.style.height = `${editTextArea.current.scrollHeight}px`;
    }

    setEditingComment(event.target.value);
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

    if (params.id !== 'list' && params.id !== 'favorite' && params.id !== 'profile') {
      fetch(`https://server.pien.kr:4000/community/reply/${params.id}`, {
        headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            let count = 0;
            const temp = [];
            const obj: IndexObjectType = {};
            setCountAll(data.data.length);

            for (let i = 0; i < data.data.length; i += 1) {
              if (!data.data[i].deleted_at) {
                if (obj[data.data[i].replyId]) {
                  obj[data.data[i].replyId] += 1;
                } else {
                  obj[data.data[i].replyId] = 1;
                }
              }
            }

            for (let i = 0; i < data.data.length; i += 1) {
              if (data.data[i].replyId === data.data[i].id) {
                if (data.data[i].deleted_at && obj[data.data[i].replyId]) {
                  temp.push(data.data[i]);
                }
              }

              if (!data.data[i].deleted_at) {
                count += 1;
                temp.push(data.data[i]);
              }
            }

            setCommentCount(count);
            setCommentData(
              temp.map((el: CommentDataType) => ({
                ...el,
                created_at: dateParsing(el.created_at)[0],
                isItNew: dateParsing(el.created_at)[1],
                isThisOrigin: el.id === el.replyId,
              })),
            );
          }
        });

      setReplying(null);
    }
  }, [params.id]);

  useEffect(() => {
    const changeDropState = (e: CustomEvent<MouseEvent>) => {
      if (
        dropBox !== null &&
        nickBoxRefs.current?.[dropBox]?.current &&
        dropBoxRefs.current?.[dropBox]?.current &&
        !dropBoxRefs.current?.[dropBox]?.current?.contains(e.target as Node) &&
        !nickBoxRefs.current?.[dropBox]?.current?.contains(e.target as Node)
      ) {
        setDropBox(null);
      }
    };

    if (dropBox !== null) {
      window.addEventListener('click', changeDropState as EventListener);
    }

    return () => {
      window.removeEventListener('click', changeDropState as EventListener);
    };
  }, [dropBox]);

  const makeComment = () => {
    if (commentWrite === '') {
      alert('내용을 입력해주세요');
    } else {
      fetch(`https://server.pien.kr:4000/community/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${loginUserToken}`,
        },
        body: JSON.stringify({ postId: params.id, comment: commentWrite }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            let count = 0;
            const temp = [];
            const obj: IndexObjectType = {};
            setCountAll(data.data.length);

            for (let i = 0; i < data.data.length; i += 1) {
              if (!data.data[i].deleted_at) {
                if (obj[data.data[i].replyId]) {
                  obj[data.data[i].replyId] += 1;
                } else {
                  obj[data.data[i].replyId] = 1;
                }
              }
            }

            for (let i = 0; i < data.data.length; i += 1) {
              if (data.data[i].replyId === data.data[i].id) {
                if (data.data[i].deleted_at && obj[data.data[i].replyId]) {
                  temp.push(data.data[i]);
                }
              }

              if (!data.data[i].deleted_at) {
                count += 1;
                temp.push(data.data[i]);
              }
            }

            setCommentCount(count);
            setCommentData(
              temp.map((el: CommentDataType) => ({
                ...el,
                created_at: dateParsing(el.created_at)[0],
                isItNew: dateParsing(el.created_at)[1],
                isThisOrigin: el.id === el.replyId,
              })),
            );
          }
        });

      setCommentWrite('');
    }
  };

  const editComment = (id: number) => {
    if (editingComment === '') {
      alert('내용을 입력해주세요');
    } else {
      fetch(`https://server.pien.kr:4000/community/reply/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${loginUserToken}`,
        },
        body: JSON.stringify({ comment: editingComment }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            setEditing(null);
            fetch(`https://server.pien.kr:4000/community/reply/${params.id}`, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${loginUserToken}`,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.isSuccess) {
                  let count = 0;
                  const temp = [];
                  const obj: IndexObjectType = {};
                  setCountAll(data.data.length);

                  for (let i = 0; i < data.data.length; i += 1) {
                    if (!data.data[i].deleted_at) {
                      if (obj[data.data[i].replyId]) {
                        obj[data.data[i].replyId] += 1;
                      } else {
                        obj[data.data[i].replyId] = 1;
                      }
                    }
                  }

                  for (let i = 0; i < data.data.length; i += 1) {
                    if (data.data[i].replyId === data.data[i].id) {
                      if (data.data[i].deleted_at && obj[data.data[i].replyId]) {
                        temp.push(data.data[i]);
                      }
                    }

                    if (!data.data[i].deleted_at) {
                      count += 1;
                      temp.push(data.data[i]);
                    }
                  }

                  setCommentCount(count);
                  setCommentData(
                    temp.map((el: CommentDataType) => ({
                      ...el,
                      created_at: dateParsing(el.created_at)[0],
                      isItNew: dateParsing(el.created_at)[1],
                      isThisOrigin: el.id === el.replyId,
                    })),
                  );
                }
              });
          } else alert(data.message);
        });
    }
  };

  const makeReplyComment = (replyId: number) => {
    if (replyComment === '') {
      alert('내용을 입력해주세요');
    } else {
      fetch(`https://server.pien.kr:4000/community/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${loginUserToken}`,
        },
        body: JSON.stringify({ postId: params.id, comment: replyComment, replyId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            let count = 0;
            const temp = [];
            const obj: IndexObjectType = {};
            setCountAll(data.data.length);

            for (let i = 0; i < data.data.length; i += 1) {
              if (!data.data[i].deleted_at) {
                if (obj[data.data[i].replyId]) {
                  obj[data.data[i].replyId] += 1;
                } else {
                  obj[data.data[i].replyId] = 1;
                }
              }
            }

            for (let i = 0; i < data.data.length; i += 1) {
              if (data.data[i].replyId === data.data[i].id) {
                if (data.data[i].deleted_at && obj[data.data[i].replyId]) {
                  temp.push(data.data[i]);
                }
              }

              if (!data.data[i].deleted_at) {
                count += 1;
                temp.push(data.data[i]);
              }
            }

            setCommentCount(count);
            setCommentData(
              temp.map((el: CommentDataType) => ({
                ...el,
                created_at: dateParsing(el.created_at)[0],
                isItNew: dateParsing(el.created_at)[1],
                isThisOrigin: el.id === el.replyId,
              })),
            );

            setReplying(null);
          }
        });

      setReplyComment('');
    }
  };

  const deleteComment = (id: number) => {
    const headers: HeadersType = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    if (loginUserToken) {
      headers.Authorization = `Bearer ${loginUserToken}`;
    } else {
      delete headers.Authorization;
    }

    if (window.confirm('댓글을 삭제하시겠습니까?') === true) {
      fetch(`https://server.pien.kr:4000/community/reply`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${loginUserToken}`,
        },
        body: JSON.stringify({ replyId: [id] }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            fetch(`https://server.pien.kr:4000/community/reply/${params.id}`, {
              headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.isSuccess) {
                  let count = 0;
                  const temp = [];
                  const obj: IndexObjectType = {};
                  setCountAll(data.data.length);

                  for (let i = 0; i < data.data.length; i += 1) {
                    if (!data.data[i].deleted_at) {
                      if (obj[data.data[i].replyId]) {
                        obj[data.data[i].replyId] += 1;
                      } else {
                        obj[data.data[i].replyId] = 1;
                      }
                    }
                  }

                  for (let i = 0; i < data.data.length; i += 1) {
                    if (data.data[i].replyId === data.data[i].id) {
                      if (data.data[i].deleted_at && obj[data.data[i].replyId]) {
                        temp.push(data.data[i]);
                      }
                    }

                    if (!data.data[i].deleted_at) {
                      count += 1;
                      temp.push(data.data[i]);
                    }
                  }

                  setCommentCount(count);
                  setCommentData(
                    temp.map((el: CommentDataType) => ({
                      ...el,
                      created_at: dateParsing(el.created_at)[0],
                      isItNew: dateParsing(el.created_at)[1],
                      isThisOrigin: el.id === el.replyId,
                    })),
                  );
                }
              });
          } else alert(data.message);
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
          <CommentBox key={el.id}>
            {el.deleted_at ? <DeletedOrigin index={i}>삭제된 댓글입니다.</DeletedOrigin> : null}
            {editing === el.id ? (
              <ReplyToReplyBox id={String(el.id)} isLastOne={i === commentData.length - 1}>
                <RTRPosting>
                  <NickAndLength>
                    <RTRNick>{loginUserNick}</RTRNick>
                    {editingComment ? <RTRLength>{editingComment.length}/3000</RTRLength> : null}
                  </NickAndLength>
                  <RTRDescription
                    ref={editTextArea}
                    onChange={editTextAreaHandler}
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
                        onClick={() => {
                          if (!loginUserToken) {
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                              navigate('/login');
                            }
                          } else {
                            editComment(el.id);
                          }
                        }}
                      >
                        수정
                      </PostThisComment>
                    </ButtonsRight>
                  </RTRBtns>
                </RTRPosting>
              </ReplyToReplyBox>
            ) : (
              <Comment index={i} isThisOrigin={el.isThisOrigin} isThisDeleted={el.deleted_at}>
                <UserImg
                  userImg={el.user.profileImage}
                  onClick={() => {
                    setProfileId(el.user.id);
                    setMenuNow(2);
                  }}
                >
                  <img src={el.user.profileImage || user} alt='user' />
                </UserImg>
                <CommentTextBox>
                  <CommentUserNick ref={nickBoxRefs.current?.[i]} onClick={() => setDropBox(i)}>
                    {el.user.nickname}
                    {dropBox === i ? (
                      <UserDropBox ref={dropBoxRefs.current?.[i]}>
                        <ul>
                          <li
                            role='presentation'
                            onClick={() => {
                              if (!loginUserToken) {
                                if (
                                  window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true
                                ) {
                                  navigate('/login');
                                }
                              } else {
                                setProfileId(el.user.id);
                                setMenuNow(2);
                              }
                            }}
                          >
                            프로필보기
                          </li>
                          <li
                            role='presentation'
                            onClick={() => {
                              if (!loginUserToken) {
                                if (
                                  window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true
                                ) {
                                  navigate('/login');
                                }
                              } else {
                                alert('서비스 준비중입니다.');
                              }
                            }}
                          >
                            1:1 채팅
                          </li>
                          <li
                            role='presentation'
                            onClick={() => {
                              if (!loginUserToken) {
                                if (
                                  window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true
                                ) {
                                  navigate('/login');
                                }
                              } else {
                                alert('서비스 준비중입니다.');
                              }
                            }}
                          >
                            쪽지보내기
                          </li>
                        </ul>
                      </UserDropBox>
                    ) : null}
                  </CommentUserNick>
                  <CommentDescription>{el.comment}</CommentDescription>
                  <CommentCreatedAt>
                    <span>{el.created_at}</span>
                    <ReplyToReply
                      onClick={() => {
                        if (!loginUserToken) {
                          if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                            navigate('/login');
                          }
                        } else {
                          setEditing(null);
                          setReplying(el.id);
                          setReplyComment('');
                        }
                      }}
                    >
                      답글쓰기
                    </ReplyToReply>
                  </CommentCreatedAt>
                </CommentTextBox>
                {loginUserId === el.user.id ? (
                  <DeleteOrEdit>
                    <Edit
                      onClick={() => {
                        setReplying(null);
                        setEditing(el.id);
                        setEditingComment(el.comment);
                      }}
                    >
                      수정
                    </Edit>
                    <Delete onClick={() => deleteComment(el.id)}>삭제</Delete>
                  </DeleteOrEdit>
                ) : null}
              </Comment>
            )}
            {replying === el.id ? (
              <ReplyToReplyBox id={String(el.id)} isLastOne={i === commentData.length - 1}>
                <RTRPosting>
                  <NickAndLength>
                    <RTRNick>{loginUserNick}</RTRNick>
                    {replyComment ? <RTRLength>{replyComment.length}/3000</RTRLength> : null}
                  </NickAndLength>

                  <RTRDescription
                    ref={replyTextArea}
                    placeholder={`${el.user.nickname}님께 답글쓰기`}
                    onChange={replyTextAreaHandler}
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
                        onClick={() => {
                          if (!loginUserToken) {
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                              navigate('/login');
                            }
                          } else {
                            makeReplyComment(el.replyId);
                          }
                        }}
                      >
                        등록
                      </PostThisComment>
                    </ButtonsRight>
                  </RTRBtns>
                </RTRPosting>
              </ReplyToReplyBox>
            ) : null}
          </CommentBox>
        ))}
      </Comments>
      <CommentPosting>
        <NickAndLength>
          <CommentPostingNick>{loginUserNick}</CommentPostingNick>
          {commentWrite ? <RTRLength>{commentWrite.length}/3000</RTRLength> : null}
        </NickAndLength>
        <CommentPostingDesc
          ref={textarea}
          placeholder={loginUserToken ? '댓글을 남겨보세요' : '로그인 후 이용 가능합니다'}
          onChange={TextAreaHandler}
          value={commentWrite}
          disabled={!loginUserToken}
        />
        <CommentPostingBtns>
          <ButtonsLeft />
          <PostThisComment
            onClick={() => {
              if (!loginUserToken) {
                if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                  navigate('/login');
                }
              } else {
                makeComment();
              }
            }}
            isThisValid={commentWrite?.length}
          >
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
const CommentBox = styled.div``;

const DeletedOrigin = styled.div<{ index: number }>`
  font-size: 13px;
  display: flex;
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
  display: inline-block;
  width: auto;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 6px;
  position: relative;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
  }
`;

const UserDropBox = styled.div`
  display: block;
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
const Edit = styled.button`
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

const ReplyToReplyBox = styled.div<{ isLastOne: boolean }>`
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

const PostThisComment = styled.button<{ isThisValid: number | undefined }>`
  width: 46px;
  height: 34px;
  border: none;
  font-weight: bold;
  font-size: 13px;
  color: ${(props) => (props.isThisValid && props.isThisValid > 0 ? 'black' : '#b7b7b7;')};
  background-color: ${(props) => (props.isThisValid && props.isThisValid > 0 ? '#feeaa3' : 'white')};
  border-radius: 5px;

  &:hover {
    cursor: pointer;
  }
`;

const UserImg = styled.div<{ userImg: string | undefined }>`
  display: flex;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 100%;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  margin-right: 10px;

  img {
    margin-top: ${(props) => (props.userImg ? 0 : '12px')};
    width: ${(props) => (props.userImg ? '35px' : '24px')};
    height: ${(props) => (props.userImg ? '35px' : '24px')};
    opacity: ${(props) => (props.userImg ? 1 : '0.2')};
  }

  &:hover {
    cursor: pointer;
  }
`;
