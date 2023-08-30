import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { CommentDataType } from '../../../../typing/types';
import { makeHeaders, getCommentData, updateComment } from '../../../../utils/functions';
import Comment from './Comment';

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

  const loginUserNick = localStorage.getItem('nickname');
  const loginUserToken = localStorage.getItem('accessToken');
  const params = useParams();
  const navigate = useNavigate();
  const headers = makeHeaders(loginUserToken);

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

  useEffect(() => {
    if (!params.id) return;
    if (params.id !== 'list' && params.id !== 'favorite' && params.id !== 'profile') {
      getCommentData(headers, params.id, setCommentCount, setCommentData);
      setReplying(null);
    }
  }, [params.id]);

  useEffect(() => {
    adjustTextArea(textarea);
    adjustTextArea(replyTextArea);
    adjustTextArea(editTextArea);
  }, [commentString, editingCommentString, replyCommentString]);

  return (
    <OuterBox data-testid='commentsbox-component'>
      <CommentHeader ref={commentWindowRef}>
        <CommentHeaderBox>
          <CommentHeaderTitle>댓글</CommentHeaderTitle>
          <span data-testid='commentCount'>{commentCount}개</span>
          {commentData?.some((el) => el.isItNew) ? <IsItNew data-testid='isItNew'>N</IsItNew> : null}
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
                    data-testid='editTextArea'
                    ref={editTextArea}
                    onChange={(event) => textAreaHandler(event, setEditingCommentString)}
                    value={editingCommentString}
                    placeholder='댓글을 남겨보세요.'
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
                        data-testid='editPostButton'
                        isThisValid={editingCommentString?.length}
                        onClick={() => {
                          if (!loginUserToken) {
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                              navigate('/login');
                            }
                          } else {
                            updateComment(
                              'edit',
                              params.id,
                              editingCommentString,
                              el.replyId,
                              headers,
                              setCommentCount,
                              setCommentData,
                              setCommentString,
                              setReplying,
                              setEditing,
                              textarea,
                            );
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
              <Comment
                index={i}
                commentData={el}
                setMenuNow={setMenuNow}
                setProfileId={setProfileId}
                dropBox={dropBox}
                setDropBox={setDropBox}
                setEditing={setEditing}
                setReplying={setReplying}
                setReplyCommentString={setReplyCommentString}
                setEditingCommentString={setEditingCommentString}
                postId={params.id}
                setCommentCount={setCommentCount}
                setCommentString={setCommentString}
                setCommentData={setCommentData}
                textarea={textarea}
              />
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
                    data-testid='replyTextArea'
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
                        data-testid='replyPostButton'
                        onClick={() => {
                          if (!loginUserToken) {
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                              navigate('/login');
                            }
                          } else {
                            updateComment(
                              'reply',
                              params.id,
                              replyCommentString,
                              el.replyId,
                              headers,
                              setCommentCount,
                              setCommentData,
                              setCommentString,
                              setReplying,
                              setEditing,
                              textarea,
                            );
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
          placeholder={loginUserToken ? '댓글을 남겨보세요.' : '로그인 후 이용 가능합니다.'}
          onChange={(event) => textAreaHandler(event, setCommentString)}
          value={commentString}
          disabled={!loginUserToken}
          data-testid='commentPostTextArea'
        />
        <CommentPostingBtns>
          <ButtonsLeft />
          <PostThisComment
            data-testid='postButton'
            onClick={() => {
              if (!loginUserToken) {
                if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                  navigate('/login');
                }
              } else {
                updateComment(
                  'create',
                  params.id,
                  commentString,
                  undefined,
                  headers,
                  setCommentCount,
                  setCommentData,
                  setCommentString,
                  setReplying,
                  setEditing,
                  textarea,
                );
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
