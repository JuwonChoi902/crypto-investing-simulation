import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import user from '../../images/user.png';
import { CommentDataType, HeadersType } from '../../../../typing/types';
import { dateParsing, handleCommentsData, makeHeaders } from '../../../../utils/functions';

type CommentsBoxProps = {
  commentWindowRef: React.RefObject<HTMLDivElement>;
  replying: number | null;
  setReplying: React.Dispatch<React.SetStateAction<number | null>>;
  commentCount: number;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | undefined | null>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
};

function CommentsBox({
  commentWindowRef,
  replying,
  setReplying,
  commentCount,
  setCommentCount,
  setProfileId,
  setMenuNow,
}: CommentsBoxProps) {
  const [commentData, setCommentData] = useState<CommentDataType[]>();
  const [commentString, setCommentString] = useState<string>('');
  const [editing, setEditing] = useState<number | null>(null);
  const [editingCommentString, setEditingCommentString] = useState<string>('');
  const [replyCommentString, setReplyCommentString] = useState<string>('');
  const [dropBox, setDropBox] = useState<number | null>(null);
  const [countAll, setCountAll] = useState<number>(0);

  const loginUserNick = localStorage.getItem('nickname');
  const loginUserToken = localStorage.getItem('accessToken');
  const loginUserId = Number(localStorage.getItem('id'));
  const params = useParams();
  const navigate = useNavigate();
  const memoizedDateParsing = useCallback(dateParsing, []);
  const memoizedHandleCommentData = useCallback(handleCommentsData, []);
  const memoizedMakeHeaders = useCallback(makeHeaders, []);

  const dropBoxRefs = useRef<Array<React.RefObject<HTMLDivElement> | undefined>>();
  const nickBoxRefs = useRef<Array<React.RefObject<HTMLDivElement> | undefined>>();

  const textarea = useRef<HTMLTextAreaElement>(null);
  const replyTextArea = useRef<HTMLTextAreaElement>(null);
  const editTextArea = useRef<HTMLTextAreaElement>(null);

  const adjustTextArea = useCallback((ref: React.RefObject<HTMLTextAreaElement>) => {
    if (ref.current) {
      const currentRef = ref.current;
      currentRef.style.height = 'auto';
      currentRef.style.height = `${ref.current.scrollHeight}px`;
    }
  }, []);

  const textAreaHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    setString: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (event.target.value.length > 1000) {
      alert('댓글은 최대 1,000자 이내로 입력 가능합니다.');
    } else {
      setString(event.target.value);
    }
  };

  const getCommentData = useCallback(
    (headers: HeadersType) => {
      fetch(`https://server.pien.kr:4000/community/reply/${params.id}`, {
        headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            const handledCommentData = memoizedHandleCommentData(
              data.data,
              setCommentCount,
              setCountAll,
              memoizedDateParsing,
            );
            setCommentData(handledCommentData);
          } else alert(data.message);
        });
    },
    [params.id],
  );

  const updateComment = useCallback(
    (
      action: 'create' | 'edit' | 'reply' | 'delete',
      postId: string | undefined,
      userInput: string | undefined,
      replyId: number | undefined,
    ) => {
      if (action === 'delete') {
        if (window.confirm('댓글을 삭제하시겠습니까?') !== true) return;
      }

      const headers = memoizedMakeHeaders(loginUserToken);
      const fetchInfoTable = {
        url: action === 'edit' ? `/${replyId}` : '',
        method: {
          create: 'POST',
          edit: 'PATCH',
          reply: 'POST',
          delete: 'DELETE',
        },
        body: {
          create: { postId, comment: userInput },
          edit: { comment: userInput },
          reply: { postId, comment: replyCommentString, replyId },
          delete: { replyId: [replyId] },
        },
      };

      fetch(`https://server.pien.kr:4000/community/reply${fetchInfoTable.url}`, {
        method: fetchInfoTable.method[action],
        headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
        body: JSON.stringify(fetchInfoTable.body[action]),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            if (action === 'create' || action === 'reply') {
              const handledCommentData = memoizedHandleCommentData(
                data.data,
                setCommentCount,
                setCountAll,
                memoizedDateParsing,
              );
              setCommentData(handledCommentData);
              if (action === 'create') {
                setCommentString('');
                if (textarea.current) textarea.current.style.height = 'auto';
              } else if (action === 'reply') setReplying(null);
            } else if (action === 'edit' || action === 'delete') {
              getCommentData(headers);
              if (action === 'edit') setEditing(null);
            }
          } else alert(data.message);
        });
    },
    [],
  );

  useEffect(() => {
    const headers = memoizedMakeHeaders(loginUserToken);
    if (params.id !== 'list' && params.id !== 'favorite' && params.id !== 'profile') {
      getCommentData(headers);
      setReplying(null);
    }
  }, [params.id]);

  useEffect(() => {
    dropBoxRefs.current = Array.from({ length: countAll }, () => React.createRef<HTMLDivElement>());
    nickBoxRefs.current = Array.from({ length: countAll }, () => React.createRef<HTMLDivElement>());
  }, [countAll]);

  useEffect(() => {
    adjustTextArea(textarea);
    adjustTextArea(replyTextArea);
    adjustTextArea(editTextArea);
  }, [commentString, editingCommentString, replyCommentString]);

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

  return (
    <OuterBox data-testid='commentsbox-component'>
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
                    {editingCommentString ? <RTRLength>{editingCommentString.length}/1000</RTRLength> : null}
                  </NickAndLength>
                  <RTRDescription
                    ref={editTextArea}
                    onChange={(event) => textAreaHandler(event, setEditingCommentString)}
                    value={editingCommentString}
                    placeholder='댓글을 남겨보세요'
                  />
                  <RTRBtns>
                    <ButtonsLeft />
                    <ButtonsRight>
                      <CancleWriting
                        onClick={() => {
                          setEditing(null);
                          setEditingCommentString('');
                        }}
                      >
                        취소
                      </CancleWriting>
                      <PostThisComment
                        isThisValid={editingCommentString?.length}
                        onClick={() => {
                          if (!loginUserToken) {
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                              navigate('/login');
                            }
                          } else {
                            updateComment('edit', params.id, editingCommentString, el.replyId);
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
                <UserImgBox>
                  <UserImg
                    userImg={el.user.profileImage}
                    onClick={() => {
                      setProfileId(el.user.id);
                      setMenuNow(2);
                    }}
                  >
                    <img src={el.user.profileImage || user} alt='user' />
                  </UserImg>
                </UserImgBox>
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
                                if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?'))
                                  navigate('/login');
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
                                if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?'))
                                  navigate('/login');
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
                                if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?'))
                                  navigate('/login');
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
                          setReplyCommentString('');
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
                        setEditingCommentString(el.comment);
                        setEditing(el.id);
                      }}
                    >
                      수정
                    </Edit>
                    <Delete onClick={() => updateComment('delete', params.id, undefined, el.id)}>삭제</Delete>
                  </DeleteOrEdit>
                ) : null}
              </Comment>
            )}
            {replying === el.id ? (
              <ReplyToReplyBox id={String(el.id)} isLastOne={i === commentData.length - 1}>
                <RTRPosting>
                  <NickAndLength>
                    <RTRNick>{loginUserNick}</RTRNick>
                    {replyCommentString ? <RTRLength>{replyCommentString.length}/1000</RTRLength> : null}
                  </NickAndLength>

                  <RTRDescription
                    ref={replyTextArea}
                    placeholder={`${el.user.nickname}님께 답글쓰기`}
                    onChange={(event) => textAreaHandler(event, setReplyCommentString)}
                    value={replyCommentString}
                  />
                  <RTRBtns>
                    <ButtonsLeft />
                    <ButtonsRight>
                      <CancleWriting
                        onClick={() => {
                          setReplying(null);
                          setReplyCommentString('');
                        }}
                      >
                        취소
                      </CancleWriting>
                      <PostThisComment
                        isThisValid={replyCommentString?.length}
                        onClick={() => {
                          if (!loginUserToken) {
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                              navigate('/login');
                            }
                          } else {
                            updateComment('reply', params.id, replyCommentString, el.replyId);
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
          {commentString ? <RTRLength>{commentString.length}/1000</RTRLength> : null}
        </NickAndLength>
        <CommentPostingDesc
          ref={textarea}
          placeholder={loginUserToken ? '댓글을 남겨보세요' : '로그인 후 이용 가능합니다'}
          onChange={(event) => textAreaHandler(event, setCommentString)}
          value={commentString}
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
                updateComment('create', params.id, commentString, undefined);
              }
            }}
            isThisValid={commentString?.length}
          >
            등록
          </PostThisComment>
        </CommentPostingBtns>
      </CommentPosting>
    </OuterBox>
  );
}

export default React.memo(CommentsBox);

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
    white-space: nowrap;
  }
`;
const CommentHeaderTitle = styled.div`
  font-size: 17px;
  font-weight: bold;
  margin: 0 12px 0 0;
  white-space: nowrap;
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
  white-space: pre-wrap;

  word-break: break-all;
  white-space: -moz-pre-wrap;
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
  white-space: nowrap;

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
  white-space: nowrap;

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
  white-space: nowrap;
`;

const NickAndLength = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 9px;
`;
const RTRLength = styled.div`
  font-size: 12px;
  color: #979797;
  white-space: nowrap;
`;

const RTRNick = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  white-space: nowrap;
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
  padding: 16px 20px 10px 18px;
  font-size: 13px;
  margin-top: 10px;
  white-space: nowrap;
`;

const CommentPostingNick = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  white-space: nowrap;
`;

const CommentPostingDesc = styled.textarea`
  border: none;
  resize: none;
  width: 100%;
  background-color: white;

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
  white-space: nowrap;

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
  white-space: nowrap;

  &:hover {
    cursor: pointer;
  }
`;

const UserImgBox = styled.div``;

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
