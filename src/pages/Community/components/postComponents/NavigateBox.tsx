import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import styled from 'styled-components';

export interface PostDetail {
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

export interface UserDetail {
  id: number;
  nickname: string;
  description: string | null;
}

type NavigateBoxProps = {
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
  postData: PostDetail | undefined;
};

interface Location {
  currentIndex: number;
  posts: PostDetail[];
}

export default function NavigateBox({ setPostNow, postData }: NavigateBoxProps) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation().state;

  const postsLength = ((obj: Location) => {
    if (obj) {
      return obj.posts.length - 1;
    }
    return null;
  })(location);

  const deletePost = () => {
    if (window.confirm('해당 게시글을 삭제하시겠습니까?') === true) {
      fetch(`http://pien.kr:4000/community/post`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJraXN1azYyM0BuYXZlci5jb20iLCJpYXQiOjE2NzM5Mzg4OTUsImV4cCI6MTY3Mzk0MDY5NX0.VWzQ1BIRwbrdAn1RLcmHol8lTtZf4Yx5we2pLpzQr3U',
        },
        body: JSON.stringify({ postId: [params.id] }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === true) {
            setPostNow(null);
          }
        });
    }
    return null;
  };

  return (
    <OuterBox>
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
    </OuterBox>
  );
}

const OuterBox = styled.div`
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
