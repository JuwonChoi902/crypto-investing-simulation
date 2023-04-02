import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import user from '../../images/user.png';
import likeFill from '../../images/likeFill.png';
import dislikeFill from '../../images/dislikeFill.png';
import comment from '../../images/comment.png';

interface PostDetail {
  id: number;
  title: string;
  description: string;
  hits: number;
  categoryId: number;
  created_at: string;
  repliesCount: number;
  isLike: boolean;
  likeCount: number;
  unLikeCount: number;
  user: UserDetail;
}

interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

type DescriptionBoxProps = {
  commentCount: number;
  commentWindowRef: React.RefObject<HTMLDivElement>;
  postData: PostDetail | undefined;
  setPostData: React.Dispatch<React.SetStateAction<PostDetail | undefined>>;
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  setReplying: React.Dispatch<React.SetStateAction<number | null>>;
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
}: DescriptionBoxProps) {
  const [isURLCopied, setIsURLCopied] = useState<boolean>(false);

  const params = useParams();
  const commentWindowY = commentWindowRef.current?.offsetTop;

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
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPostData({ ...data, created_at: dateParsing(data.created_at)[0] });
        });

      setReplying(null);
    }
  }, [params.id]);

  const likeThisPost = () => {
    if (postData?.isLike !== true) {
      fetch(`http://pien.kr:4000/community/like/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
        body: JSON.stringify({ isLike: true }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPostData({ ...data, created_at: dateParsing(data.created_at)[0] });
        });
    } else {
      fetch(`http://pien.kr:4000/community/like/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPostData({ ...data, created_at: dateParsing(data.created_at)[0] });
        });
    }
  };

  const dislikeThisPost = () => {
    if (postData?.isLike !== false) {
      fetch(`http://pien.kr:4000/community/like/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
        body: JSON.stringify({ isLike: false }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPostData({ ...data, created_at: dateParsing(data.created_at)[0] });
        });
    } else {
      fetch(`http://pien.kr:4000/community/like/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPostData({ ...data, created_at: dateParsing(data.created_at)[0] });
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

  return (
    <OuterBox>
      <TitleBox>
        <Board
          onClick={() => {
            if (postData) {
              setPostNow(null);
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
          <LikeBox isLiked={postData?.isLike} onClick={likeThisPost}>
            <div>추천</div>
            <span>{postData?.likeCount}</span>
            <LikeImg src={likeFill} alt='like' isLiked={postData?.isLike} />
          </LikeBox>
          <DisLikeBox isLiked={postData?.isLike} onClick={dislikeThisPost}>
            <DislikeImg src={dislikeFill} alt='dislike' isLiked={postData?.isLike} />
            <span>{postData?.unLikeCount}</span>
            <div>비추천</div>
          </DisLikeBox>
        </LikeAndHate>
        <Report>신고</Report>
      </LikeAndHateBox>
    </OuterBox>
  );
}

const OuterBox = styled.div``;
const TitleBox = styled.div`
  height: 54px;
  margin-bottom: 12px;
`;

const Board = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.style.yellow};
  margin-bottom: 7px;
  font-weight: bold;

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
  border-radius: 4px;
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
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
`;
const LikeBox = styled.div<{ isLiked: any }>`
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
  }
`;
const DisLikeBox = styled.div<{ isLiked: any }>`
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
  }
`;
const LikeImg = styled.img<{ isLiked: any }>`
  width: 16px;
  margin-right: 10px;
  opacity: ${(props) => (props.isLiked === true ? '1' : '0.5')};
`;

const DislikeImg = styled.img<{ isLiked: any }>`
  width: 16px;
  margin-right: 10px;
  opacity: ${(props) => (props.isLiked === false ? '1' : '0.5')};
`;

const Report = styled.div`
  position: absolute;
  right: 0;
  font-size: 13px;

  &:hover {
    cursor: pointer;
  }
`;
