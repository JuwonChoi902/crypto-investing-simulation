import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { CommentDataType } from '../../../../typing/types';
import { makeHeaders, updateComment } from '../../../../utils/functions';
import userImg from '../../images/user.png';

type CommentProps = {
  index: number;
  commentData: CommentDataType;
  dropBox: number | null;
  postId: string | undefined;
  setReplying: React.Dispatch<React.SetStateAction<number | null>>;
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
  setDropBox: React.Dispatch<React.SetStateAction<number | null>>;
  setEditing: React.Dispatch<React.SetStateAction<number | null>>;
  setReplyCommentString: React.Dispatch<React.SetStateAction<string>>;
  setEditingCommentString: React.Dispatch<React.SetStateAction<string>>;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
  setCommentString: React.Dispatch<React.SetStateAction<string>>;
  setCommentData: React.Dispatch<React.SetStateAction<CommentDataType[] | undefined>>;
  textarea: React.RefObject<HTMLTextAreaElement>;
};

const DropBoxMenu: string[] = ['프로필보기', '1:1 채팅', '쪽지보내기'];

export default function Comment({
  index,
  commentData,
  setMenuNow,
  setProfileId,
  dropBox,
  setDropBox,
  setEditing,
  setReplying,
  setReplyCommentString,
  setEditingCommentString,
  postId,
  setCommentCount,
  setCommentString,
  setCommentData,
  textarea,
}: CommentProps) {
  const loginUserToken = localStorage.getItem('accessToken');
  const loginUserId = Number(localStorage.getItem('id'));
  const navigate = useNavigate();
  const dropBoxRef = useRef<HTMLDivElement>(null);
  const nickBoxRef = useRef<HTMLDivElement>(null);
  const headers = makeHeaders(loginUserToken);

  useEffect(() => {
    const changeDropState = (e: CustomEvent<MouseEvent>) => {
      if (
        dropBoxRef.current &&
        nickBoxRef &&
        !nickBoxRef.current?.contains(e.target as Node) &&
        !dropBoxRef.current?.contains(e.target as Node)
      ) {
        setDropBox(null);
      }
    };

    if (dropBox === index) {
      window.addEventListener('click', changeDropState as EventListener);
    }

    return () => {
      window.removeEventListener('click', changeDropState as EventListener);
    };
  }, [dropBox]);

  return (
    <OuterBox index={index} isThisOrigin={commentData.isThisOrigin} isThisDeleted={commentData.deleted_at}>
      <UserImgBox>
        <UserImg
          data-testid='userImg'
          userImg={commentData.user.profileImage}
          onClick={() => {
            setProfileId(commentData.user.id);
            setMenuNow(2);
          }}
        >
          <img src={commentData.user.profileImage || userImg} alt='user' />
        </UserImg>
      </UserImgBox>
      <CommentTextBox>
        <CommentUserNick data-testid='userNickForDropBox' ref={nickBoxRef} onClick={() => setDropBox(index)}>
          {commentData.user.nickname}
          {dropBox === index ? (
            <UserDropBox ref={dropBoxRef}>
              <ul>
                {DropBoxMenu.map((menu, index) => (
                  <li
                    key={menu}
                    role='presentation'
                    onClick={() => {
                      if (!loginUserToken) {
                        if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                          navigate('/login');
                        }
                      } else if (index === 0) {
                        setProfileId(commentData.user.id);
                        setMenuNow(2);
                      } else {
                        alert('서비스 준비중입니다.');
                      }
                    }}
                  >
                    {menu}
                  </li>
                ))}
              </ul>
            </UserDropBox>
          ) : null}
        </CommentUserNick>
        <CommentDescription data-testid='commentDesc'>{commentData.comment}</CommentDescription>
        <CommentCreatedAt>
          <span>{commentData.created_at}</span>
          <ReplyToReply
            onClick={() => {
              if (!loginUserToken) {
                if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                  navigate('/login');
                }
              } else {
                setEditing(null);
                setReplying(commentData.id);
                setReplyCommentString('');
              }
            }}
          >
            답글쓰기
          </ReplyToReply>
        </CommentCreatedAt>
      </CommentTextBox>
      {loginUserId === commentData.user.id ? (
        <DeleteOrEdit>
          <Edit
            data-testid='editThisComment'
            onClick={() => {
              setReplying(null);
              setEditingCommentString(commentData.comment);
              setEditing(commentData.id);
            }}
          >
            수정
          </Edit>
          <Delete
            data-testid='deleteThisComment'
            onClick={() =>
              updateComment(
                'delete',
                postId,
                undefined,
                commentData.id,
                headers,
                setCommentCount,
                setCommentData,
                setCommentString,
                setReplying,
                setEditing,
                textarea,
              )
            }
          >
            삭제
          </Delete>
        </DeleteOrEdit>
      ) : null}
    </OuterBox>
  );
}

const OuterBox = styled.div<{
  index: number;
  isThisOrigin: boolean | undefined;
  isThisDeleted: string | null;
}>`
  display: ${(props) => (props.isThisDeleted ? 'none' : 'flex')};
  position: relative;
  padding: 12px 0 10px 0;
  border-top: ${(props) => (props.index === 0 ? 'none' : '1px solid #e5e5e5')};
  padding-left: ${(props) => (props.isThisOrigin ? '0' : '46px')};
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
