import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import user from '../../images/user.png';
import likeFill from '../../images/likeFill.png';
import dislikeFill from '../../images/dislikeFill.png';
import comment from '../../images/comment.png';
import { HeadersType, PostDataType } from '../../../../typing/types';
import { dateParsing } from '../../../../utils/functions';

type DescriptionBoxProps = {
  commentCount: number;
  commentWindowRef: React.RefObject<HTMLDivElement>;
  postData: PostDataType | undefined;
  setPostData: React.Dispatch<React.SetStateAction<PostDataType | undefined>>;
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  setReplying: React.Dispatch<React.SetStateAction<number | null>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
};

const PostCategory: string[] = ['전체글보기', '질문하기', '자랑하기', '공유하기', '잡담하기'];

export default function DescriptionBox({
  commentCount,
  setPostNow,
  commentWindowRef,
  setBoardNow,
  setReplying,
  postData,
  setPostData,
  setMenuNow,
  setProfileId,
}: DescriptionBoxProps) {
  const [isURLCopied, setIsURLCopied] = useState<boolean>(false);
  const [dropBoxIsOpen, setDropBoxIsOpen] = useState<boolean>(false);

  const params = useParams();
  const commentWindowY = commentWindowRef.current?.offsetTop;
  const dropBoxRef = useRef<HTMLDivElement>(null);
  const nickBoxRef = useRef<HTMLDivElement>(null);
  const loginUserToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

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
      setPostNow(Number(params.id));

      fetch(`https://server.pien.kr:4000/community/${params.id}`, {
        headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            setPostData({ ...data.data, created_at: dateParsing(data.data.created_at)[0] });
          }
        });

      setReplying(null);
    }
  }, [params.id]);

  const likeThisPost = () => {
    if (!loginUserToken) {
      if (window.confirm('로그인 후 가능합니다. 로그인을 하시겠습니까?') === true) {
        navigate('/login');
      }
    } else if (postData?.isLike !== true) {
      fetch(`https://server.pien.kr:4000/community/like/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${loginUserToken}`,
        },
        body: JSON.stringify({ isLike: true }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            setPostData({ ...data.data, created_at: dateParsing(data.data.created_at)[0] });
          } else {
            alert(data.message);
          }
        });
    } else {
      fetch(`https://server.pien.kr:4000/community/like/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${loginUserToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            setPostData({ ...data.data, created_at: dateParsing(data.data.created_at)[0] });
          } else {
            alert(data.message);
          }
        });
    }
  };

  const dislikeThisPost = () => {
    if (!loginUserToken) {
      if (window.confirm('로그인 후 가능합니다. 로그인을 하시겠습니까?') === true) {
        navigate('/login');
      }
    } else if (postData?.isLike !== false) {
      fetch(`https://server.pien.kr:4000/community/like/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${loginUserToken}`,
        },
        body: JSON.stringify({ isLike: false }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            setPostData({ ...data.data, created_at: dateParsing(data.data.created_at)[0] });
          } else {
            alert(data.message);
          }
        });
    } else {
      fetch(`https://server.pien.kr:4000/community/like/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${loginUserToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) {
            setPostData({ ...data.data, created_at: dateParsing(data.data.created_at)[0] });
          } else {
            alert(data.message);
          }
        });
    }
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

  useEffect(() => {
    const changeDropState = (e: CustomEvent<MouseEvent>) => {
      if (
        dropBoxRef.current &&
        nickBoxRef &&
        !nickBoxRef.current?.contains(e.target as Node) &&
        !dropBoxRef.current?.contains(e.target as Node)
      ) {
        setDropBoxIsOpen((cur) => !cur);
      }
    };

    if (dropBoxIsOpen) {
      window.addEventListener('click', changeDropState as EventListener);
    }

    return () => {
      window.removeEventListener('click', changeDropState as EventListener);
    };
  }, [dropBoxIsOpen]);

  return (
    <OuterBox data-testid='descriptionbox-component'>
      <TitleBox>
        <Board
          onClick={() => {
            if (postData) {
              navigate('/community/list');
              setBoardNow(postData.categoryId);
            }
          }}
        >
          {postData ? PostCategory[postData.categoryId] : null}
        </Board>
        <Title>{postData?.title}</Title>
      </TitleBox>
      <UserInfo>
        <UserDesc>
          <UserImg
            userImg={postData?.user.profileImage}
            role='presentation'
            onClick={() => {
              if (!loginUserToken) {
                if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                  navigate('/login');
                }
              } else {
                setProfileId(postData?.user.id);
                setMenuNow(2);
              }
            }}
          >
            <img src={postData?.user.profileImage || user} alt='user' />
          </UserImg>
          <UserDetail>
            <DetailNickBox>
              <DetailNick ref={nickBoxRef} onClick={() => setDropBoxIsOpen((current) => !current)}>
                {postData?.user?.nickname}
                {dropBoxIsOpen ? (
                  <UserDropBox ref={dropBoxRef}>
                    <ul>
                      <li
                        role='presentation'
                        onClick={() => {
                          if (!loginUserToken) {
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                              navigate('/login');
                            }
                          } else {
                            setProfileId(postData?.user.id);
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
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
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
                            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
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
              </DetailNick>
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
      <ShowMore
        onClick={() => {
          if (!loginUserToken) {
            if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
              navigate('/login');
            }
          } else {
            setProfileId(postData?.user.id);
            setMenuNow(2);
          }
        }}
      >
        <UserImg userImg={postData?.user.profileImage}>
          <img src={postData?.user.profileImage || user} alt='user' />
        </UserImg>
        <span>{postData?.user.nickname}</span>
        <div>님의 게시글 더보기</div>
      </ShowMore>
      <LikeAndHateBox>
        <LikeAndHate>
          <LikeBox isLiked={postData?.isLike} onClick={likeThisPost}>
            <div>좋아요</div>
            <span>{postData?.likeCount}</span>
            <LikeImg src={likeFill} alt='like' isLiked={postData?.isLike} />
          </LikeBox>
          <DisLikeBox isLiked={postData?.isLike} onClick={dislikeThisPost}>
            <DislikeImg src={dislikeFill} alt='dislike' isLiked={postData?.isLike} />
            <span>{postData?.unLikeCount}</span>
            <div>싫어요</div>
          </DisLikeBox>
        </LikeAndHate>
        <Report>신고</Report>
      </LikeAndHateBox>
    </OuterBox>
  );
}

const OuterBox = styled.div``;
const TitleBox = styled.div`
  margin-bottom: 12px;
`;

const Board = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.style.yellow};
  margin-bottom: 7px;
  font-weight: bold;
  width: 60px;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
  }
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
const UserDetail = styled.div``;

const DetailNickBox = styled.div`
  display: flex;
  font-size: 13px;
  margin-bottom: 6px;
`;
const DetailNick = styled.div`
  font-weight: bold;
  margin-right: 6px;
  position: relative;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
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

const DetailRank = styled.div`
  margin-right: 6px;
  color: #676767;
  white-space: nowrap;
`;
const AskChat = styled.button`
  background-color: #eff0f2;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;

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
  white-space: nowrap;
`;
const Hits = styled.div`
  white-space: nowrap;
`;
const ButtonBox = styled.div`
  display: flex;
`;
const GoComment = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
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
  white-space: nowrap;
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
  white-space: nowrap;

  &:hover {
    cursor: pointer;
  }
`;

const IsCopied = styled.div<{ isURLCopied: boolean }>`
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
  white-space: nowrap;
`;
const Description = styled.div`
  font-size: 14px;
  padding-top: 54px;
`;
const ShowMore = styled.div`
  display: flex;
  width: 205px;
  align-items: center;
  height: 36px;
  font-size: 13px;
  margin: 40px 0 26px 0;
  white-space: nowrap;

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
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
`;
const LikeBox = styled.div<{ isLiked: boolean | null | undefined }>`
  display: flex;
  &:hover {
    cursor: pointer;
  }
  div {
    font-weight: ${(props) => (props.isLiked === true ? 'bold' : 'normal')};
  }

  span {
    color: ${(props) => (props.isLiked === true ? 'black' : '#b7b7b7')};
    margin-right: 10px;
    font-weight: bold;
    white-space: nowrap;
  }
`;
const DisLikeBox = styled.div<{ isLiked: boolean | null | undefined }>`
  display: flex;
  &:hover {
    cursor: pointer;
  }

  div {
    font-weight: ${(props) => (props.isLiked === false ? 'bold' : 'normal')};
  }

  span {
    color: ${(props) => (props.isLiked === false ? 'black' : '#b7b7b7;')};
    margin-right: 10px;
    font-weight: bold;
    white-space: nowrap;
  }
`;
const LikeImg = styled.img<{ isLiked: boolean | null | undefined }>`
  width: 16px;
  margin-right: 10px;
  opacity: ${(props) => (props.isLiked === true ? '1' : '0.5')};
`;

const DislikeImg = styled.img<{ isLiked: boolean | null | undefined }>`
  width: 16px;
  margin-right: 10px;
  opacity: ${(props) => (props.isLiked === false ? '1' : '0.5')};
`;

const Report = styled.div`
  position: absolute;
  right: 0;
  font-size: 13px;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
  }
`;
