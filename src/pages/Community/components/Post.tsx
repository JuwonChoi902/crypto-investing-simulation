import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import user from '../images/user.png';
import comment from '../images/comment.png';
import likeFill from '../images/likeFill.png';
import dislikeFill from '../images/dislikeFill.png';
import write from '../images/write.png';

type PostIdProps = {
  id: number;
};

interface PostDetail {
  id: number;
  title: string;
  description: string;
  created_at: string;
  hits: number;
  user: UserDetail;
}

export interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

export default function Post({ id }: PostIdProps) {
  const [postData, setPostData] = useState<PostDetail>();
  useEffect(() => {
    fetch(`http://172.20.10.2:3000/community?page=1&number=10`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .then((data) => setPostData(data));
  }, []);

  const textarea = useRef<HTMLTextAreaElement>(null);

  const TextAreaHandler = () => {
    if (textarea.current) {
      textarea.current.style.height = 'auto';
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  };

  return (
    <OuterBox>
      <NavigateBox>
        <Previous type='button'>이전글</Previous>
        <Next type='button'>다음글</Next>
        <List type='button'>목록</List>
      </NavigateBox>
      <MainBox>
        <TitleBox>
          <Label>질문</Label>
          <Title>빈티지 컨버스 사이즈 현행과 동일하게 가야하나요?</Title>
        </TitleBox>
        <UserInfo>
          <UserDesc>
            <UserImg>
              <img src={user} alt='user' />
            </UserImg>
            <UserDetail>
              <DetailNickBox>
                <DetailNick>장기석</DetailNick>
                <DetailRank>132위</DetailRank>
                <AskChat>1:1 채팅</AskChat>
              </DetailNickBox>
              <DetailPostInfo>
                <CreatedAt>2022.12.16. 02:20</CreatedAt>
                <Hits>325</Hits>
              </DetailPostInfo>
            </UserDetail>
          </UserDesc>
          <ButtonBox>
            <GoComment>
              <img src={comment} alt='comment' />
              <HowManyComment>
                <div>댓글</div>
                <span>5</span>
              </HowManyComment>
            </GoComment>
            <GoShare>URL 복사</GoShare>
          </ButtonBox>
        </UserInfo>
        <Description>제가 빈티지 컨버스는 처음이라 그런데, 현행이랑 동일 사이즈 가면 될까요?</Description>
        <ShowMore>
          <UserImg>
            <img src={user} alt='user' />
          </UserImg>
          <span>장기석</span>
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
          <CommentHeader>
            <CommentTitle>
              <div>댓글</div>
              <span>5개</span>
            </CommentTitle>
          </CommentHeader>
          <Comments>
            <Comment />
          </Comments>
          <CommentPosting>
            <CommentPostingNick />
            <CommentPostingDesc ref={textarea} placeholder='댓글을 남겨보세요' onInput={TextAreaHandler} />
            <CommentPostingBtns>
              <Buttons />
              <PostThisComment>등록</PostThisComment>
            </CommentPostingBtns>
          </CommentPosting>
        </CommentBox>
      </MainBox>
      <NavigateBox2>
        <NaviLeft>
          <WritePost>
            <img src={write} alt='write' />
            글쓰기
          </WritePost>
          <ReplyThisPost>답글</ReplyThisPost>
        </NaviLeft>
        <NaviRight>
          <ShowList>목록</ShowList>
          <GoToTheTop>맨 위로</GoToTheTop>
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
  justify-content: end;
  padding-bottom: 14px;
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
  border-bottom: 1px solid #e5e5e5; ;
`;

const UserDesc = styled.div`
  display: flex;
  align-items: center;
`;

const UserImg = styled.div`
  display: flex;
  justify-content: center;
  width: 36px;
  height: 36px;
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
const CommentTitle = styled.div`
  display: flex;

  div {
    font-size: 17px;
    font-weight: bold;
    margin: 0 12px 0 0;
  }

  span {
    font-size: 13px;
    font-weight: bold;
    color: #b7b7b7;
  }
`;
const Comments = styled.div``;
const Comment = styled.div``;
const CommentPosting = styled.div`
  border: 2px solid #e5e5e5;
  border-radius: 5px;
  padding: 16px 10px 10px 18px;
  font-size: 13px;
`;
const CommentPostingNick = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;
const CommentPostingDesc = styled.textarea`
  margin-bottom: 10px;
  border: none;
  resize: none;
  width: 100%;
  background-color: white;
  overflow: visible;

  &:focus {
    outline: none;
  }
`;
const CommentPostingBtns = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Buttons = styled.div``;
const PostThisComment = styled.button`
  width: 46px;
  height: 34px;
  border: none;
  font-weight: bold;
  color: #b7b7b7;
  background-color: white;
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
