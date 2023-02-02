import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, useParams } from 'react-router';
import user from '../images/user.png';
import comment from '../images/comment.png';
import likeFill from '../images/likeFill.png';
import dislikeFill from '../images/dislikeFill.png';
import write from '../images/write.png';

type PostIdProps = {
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
};

interface PostDetail {
  id: number;
  title: string;
  description: string;
  created_at: string;
  hits: number;
  label: string;
  user: UserDetail;
}

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

interface Comments {
  number: number;
  reply: CommentDetail;
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

export default function Post({ setPostNow }: PostIdProps) {
  const [postData, setPostData] = useState<PostDetail>();
  const [commentData, setCommentData] = useState<CommentDetail[]>();
  const [commentWrite, setCommentWrite] = useState<string>('');
  const [editing, setEditing] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<string>();
  const [replying, setReplying] = useState<number | null>(null);
  const [replyComment, setReplyComment] = useState<string>();
  const [isURLCopied, setIsURLCopied] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);

  const commentWindowRef = useRef<HTMLDivElement>(null);
  const commentWindowY = commentWindowRef.current?.offsetTop;

  const navigate = useNavigate();
  const location = useLocation().state;
  const params = useParams();

  interface Location {
    currentIndex: number;
    posts: PostDetail[];
  }

  const postsLength = ((obj: Location) => {
    if (obj) {
      return obj.posts.length - 1;
    }
    return null;
  })(location);

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

  useEffect(() => {
    if (params.id === 'list') {
      setPostNow(null);
    } else {
      setPostNow(Number(params.id));

      fetch(`http://pien.kr:4000/community/${params.id}`, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then((res) => res.json())
        .then((data) => setPostData({ ...data, created_at: dateParsing(data.created_at)[0] }));

      fetch(`http://pien.kr:4000/community/reply/${params.id}`, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          let count = 0;
          const temp = [];

          for (let i = 0; i < data.length; i += 1) {
            if (data[i].replyId === data[i].id) {
              if (data[i].deleted_at && !data[i + 1]?.deleted_at) {
                if (data[i].replyId === data[i + 1]?.replyId) {
                  temp.push(data[i]);
                }
              }
            }
            if (!data[i].deleted_at) {
              count += 1;
              temp.push(data[i]);
            }
          }

          console.log(temp);

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
    }
  }, [params.id]);

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

          for (let i = 0; i < data.length; i += 1) {
            if (data[i].replyId === data[i].id) {
              if (data[i].deleted_at && !data[i + 1]?.deleted_at) {
                if (data[i].replyId === data[i + 1]?.replyId) {
                  temp.push(data[i]);
                }
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

          for (let i = 0; i < data.length; i += 1) {
            if (data[i].replyId === data[i].id) {
              if (data[i].deleted_at && !data[i + 1]?.deleted_at) {
                if (data[i].replyId === data[i + 1]?.replyId) {
                  temp.push(data[i]);
                }
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
  console.log(commentData);

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
              },
            })
              .then((res) => res.json())
              .then((data) => {
                let count = 0;
                const temp = [];

                for (let i = 0; i < data.length; i += 1) {
                  if (data[i].replyId === data[i].id) {
                    if (data[i].deleted_at && !data[i + 1]?.deleted_at) {
                      if (data[i].replyId === data[i + 1]?.replyId) {
                        temp.push(data[i]);
                      }
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

  const deleteComment = (id: number) => {
    fetch(`http://pien.kr:4000/community/reply/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === true) {
          fetch(`http://pien.kr:4000/community/reply/${params.id}`, {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
          })
            .then((res) => res.json())
            .then((data) => {
              let count = 0;
              const temp = [];

              for (let i = 0; i < data.length; i += 1) {
                if (data[i].replyId === data[i].id) {
                  if (data[i].deleted_at && !data[i + 1]?.deleted_at) {
                    if (data[i].replyId === data[i + 1]?.replyId) {
                      temp.push(data[i]);
                    }
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
  };

  const deletePost = () => {
    fetch(`http://pien.kr:4000/community/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === true) {
          setPostNow(null);
        }
      });
  };

  const copyURL = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsURLCopied(true);
    } catch (error) {
      alert('copy error');
    }
  };

  useEffect(() => {
    const popUpTimeOut = setTimeout(() => {
      setIsURLCopied(false);
    }, 2000);

    return () => clearTimeout(popUpTimeOut);
  }, [isURLCopied]);

  return (
    <OuterBox>
      <NavigateBox>
        <NavigateLeft>
          <EditPost
            onClick={() =>
              navigate(`/community/posting`, {
                state: {
                  postData,
                },
              })
            }
          >
            수정
          </EditPost>
          <DeletePost onClick={deletePost}>삭제</DeletePost>
        </NavigateLeft>
        <NavigateRight>
          {location?.currentIndex === 0 ? null : (
            <Previous
              type='button'
              onClick={() =>
                navigate(`/community/${location?.posts[location.currentIndex - 1].id}`, {
                  state: {
                    currentIndex: location.currentIndex - 1,
                    posts: location.posts,
                  },
                })
              }
            >
              이전글
            </Previous>
          )}
          {location?.currentIndex === postsLength ? null : (
            <Next
              type='button'
              onClick={() =>
                navigate(`/community/${location?.posts[location.currentIndex + 1].id}`, {
                  state: {
                    currentIndex: location.currentIndex + 1,
                    posts: location.posts,
                  },
                })
              }
            >
              다음글
            </Next>
          )}
          <List
            type='button'
            onClick={() => {
              navigate('/community/list');
              setPostNow(null);
            }}
          >
            목록
          </List>
        </NavigateRight>
      </NavigateBox>
      <MainBox>
        <TitleBox>
          <Label>{postData?.label}</Label>
          <Title>{postData?.title}</Title>
        </TitleBox>
        <UserInfo>
          <UserDesc>
            <UserImg>
              <img src={user} alt='user' />
            </UserImg>
            <UserDetail>
              <DetailNickBox>
                <DetailNick>{postData?.user?.nickname}</DetailNick>
                <DetailRank>132위</DetailRank>
                <AskChat>1:1 채팅</AskChat>
              </DetailNickBox>
              <DetailPostInfo>
                <CreatedAt>{postData?.created_at}</CreatedAt>
                <Hits>{postData?.hits}</Hits>
              </DetailPostInfo>
            </UserDetail>
          </UserDesc>
          <ButtonBox>
            <GoComment
              onClick={() => {
                if (commentWindowY) window.scrollTo(0, commentWindowY + 300);
              }}
            >
              <img src={comment} alt='comment' />
              <HowManyComment>
                <div>댓글</div>
                <span>{commentCount}</span>
              </HowManyComment>
            </GoComment>
            <GoShare onClick={() => copyURL(window.location.href)}>URL 복사</GoShare>
          </ButtonBox>
          <IsCopied isURLCopied={isURLCopied}>URL이 복사되었습니다.</IsCopied>
        </UserInfo>
        <Description>{postData?.description}</Description>
        <ShowMore>
          <UserImg>
            <img src={user} alt='user' />
          </UserImg>
          <span>{postData?.user.nickname}</span>
          <div>님의 게시글 더보기</div>
        </ShowMore>
        <LikeAndHateBox>
          <LikeAndHate>
            <LikeBox>
              <div>추천</div>
              <span>5</span>
              <LikeImg src={likeFill} alt='like' />
            </LikeBox>
            <DisLikeBox>
              <DislikeImg src={dislikeFill} alt='dislike' />
              <span>0</span>
              <div>비추천</div>
            </DisLikeBox>
          </LikeAndHate>
          <Report>신고</Report>
        </LikeAndHateBox>
        <CommentBox>
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
                    <UserImg>
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
        </CommentBox>
      </MainBox>
      <NavigateBox2>
        <NaviLeft>
          <WritePost onClick={() => navigate('/community/posting')}>
            <img src={write} alt='write' />
            글쓰기
          </WritePost>
          <ReplyThisPost>답글</ReplyThisPost>
        </NaviLeft>
        <NaviRight>
          <ShowList
            onClick={() => {
              navigate('/community/list');
              setPostNow(null);
            }}
          >
            목록
          </ShowList>
          <GoToTheTop onClick={() => window.scrollTo(0, 0)}>맨 위로</GoToTheTop>
        </NaviRight>
      </NavigateBox2>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 860px;
`;
const NavigateBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 14px;
`;
const NavigateLeft = styled.div`
  display: flex;
`;
const NavigateRight = styled.div`
  display: flex;
`;

const EditPost = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 76px;
  height: 36px;
  background-color: #eff0f2;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`;
const DeletePost = styled.div`
  ${(props) => props.theme.variables.flex()}
  width: 76px;
  height: 36px;
  background-color: #eff0f2;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;

  &:hover {
    cursor: pointer;
  }
`;

const Previous = styled.button`
  ${(props) => props.theme.variables.flex()}
  width: 76px;
  height: 36px;
  background-color: #eff0f2;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`;

const Next = styled.button`
  ${(props) => props.theme.variables.flex()}
  width: 76px;
  height: 36px;
  background-color: #eff0f2;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`;
const List = styled.button`
  ${(props) => props.theme.variables.flex()}
  width: 48px;
  height: 36px;
  background-color: #eff0f2;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`;

const MainBox = styled.div`
  border: 1px solid #e5e5e5;
  padding: 29px;
  border-radius: 5px;
  position: relative;
`;

const TitleBox = styled.div`
  height: 54px;
  margin-bottom: 12px;
`;

const Label = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.style.yellow};
  margin-bottom: 7px;
  font-weight: bold;
`;
const Title = styled.div`
  font-size: 26px;
  font-weight: bold;
`;
const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  height: 36px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
`;

const UserDesc = styled.div`
  display: flex;
  align-items: center;
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
const UserDetail = styled.div``;

const DetailNickBox = styled.div`
  display: flex;
  font-size: 13px;
  margin-bottom: 6px;
`;
const DetailNick = styled.div`
  font-weight: bold;
  margin-right: 6px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const DetailRank = styled.div`
  margin-right: 6px;
  color: #676767;
`;
const AskChat = styled.button`
  background-color: #eff0f2;
  border: none;
  font-size: 11px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`;
const DetailPostInfo = styled.div`
  display: flex;
  font-size: 12px;
  color: #979797;
`;

const CreatedAt = styled.div`
  margin-right: 6px;
`;
const Hits = styled.div``;
const ButtonBox = styled.div`
  display: flex;
`;
const GoComment = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 3px;
  }
  margin-right: 16px;
  &:hover {
    cursor: pointer;
  }
`;
const HowManyComment = styled.div`
  display: flex;
  font-size: 13px;
  div {
    margin-right: 5px;
  }
  span {
    font-weight: bold;
  }
`;
const GoShare = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;

  &:hover {
    cursor: pointer;
  }
`;

const IsCopied = styled.div<{ isURLCopied: any }>`
  ${(props) => props.theme.variables.flex()}
  opacity:${(props) => (props.isURLCopied ? '100' : '0')};
  position: absolute;
  top: 135px;
  right: 10px;
  background-color: grey;
  color: white;
  font-weight: bold;
  font-size: 13px;
  width: 150px;
  height: 20px;
  border-radius: 5px;
  transition: 0.2s opacity ease-in-out;
`;
const Description = styled.div`
  font-size: 14px;
  padding-top: 54px;
`;
const ShowMore = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  font-size: 13px;
  margin: 40px 0 26px 0;

  span {
    font-weight: bold;
  }

  &:hover {
    cursor: pointer;
  }
`;

const LikeAndHateBox = styled.div`
  display: flex;
  position: relative;
`;
const LikeAndHate = styled.div`
  display: flex;
  justify-content: center;
  font-size: 13px;
  width: 100%;
  div {
    margin-right: 10px;
  }
  img {
    width: 16px;
    margin-right: 10px;
    opacity: 0.5;
  }
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
`;
const LikeBox = styled.div`
  display: flex;
  &:hover {
    cursor: pointer;
  }

  span {
    color: #b7b7b7;
    margin-right: 10px;
    font-weight: bold;
  }
`;
const DisLikeBox = styled.div`
  display: flex;
  &:hover {
    cursor: pointer;
  }

  span {
    color: #b7b7b7;
    margin-right: 10px;
    font-weight: bold;
  }
`;
const LikeImg = styled.img``;
const DislikeImg = styled.img``;
const Report = styled.div`
  position: absolute;
  right: 0;
  font-size: 13px;

  &:hover {
    cursor: pointer;
  }
`;
const CommentBox = styled.div``;
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

const NavigateBox2 = styled.div`
  display: flex;
  justify-content: space-between;

  padding-top: 14px;
`;
const NaviLeft = styled.div`
  display: flex;
`;
const WritePost = styled.button`
  ${(props) => props.theme.variables.flex()}
  border: none;
  width: 75px;
  height: 36px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  background-color: #feeaa3;
  margin-right: 10px;

  img {
    opacity: 0.6;
    width: 16px;
    margin-right: 5px;
  }

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.style.buttonYellow};
  }
`;
const ReplyThisPost = styled.button`
  ${(props) => props.theme.variables.flex()}
  background-color: #eff0f2;
  width: 48px;
  height: 36px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`;

const NaviRight = styled.div`
  display: flex;
`;

const ShowList = styled.button`
  ${(props) => props.theme.variables.flex()}
  background-color: #eff0f2;
  width: 48px;
  height: 36px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`;

const GoToTheTop = styled.button`
  ${(props) => props.theme.variables.flex()}
  background-color: #eff0f2;
  width: 56px;
  height: 36px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`;
