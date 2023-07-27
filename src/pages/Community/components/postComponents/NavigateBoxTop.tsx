import React from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { PostDataType, HeadersType } from '../../../../typing/types';
import arrowUp from '../../images/arrowUpBlack.png';
import arrowDown from '../../images/arrowDownBlack.png';

type NavigateBoxTopProps = {
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
  postData: PostDataType | undefined;
};

export default function NavigateBoxTop({ setPostNow, postData }: NavigateBoxTopProps) {
  const navigate = useNavigate();
  const params = useParams();
  const loginUserId = Number(localStorage.getItem('id'));
  const loginUserToken = localStorage.getItem('accessToken');

  const deletePost = () => {
    const headers: HeadersType = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    if (loginUserToken) {
      headers.Authorization = `Bearer ${loginUserToken}`;
    } else {
      delete headers.Authorization;
    }

    if (window.confirm('해당 게시글을 삭제하시겠습니까?') === true) {
      fetch(`https://server.pien.kr:4000/community/post`, {
        method: 'DELETE',
        headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
        body: JSON.stringify({ postId: [Number(params.id)] }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess === true) {
            setPostNow(null);
          } else {
            alert('해당 게시글의 삭제 권한이 없습니다.');
          }
        });
    }
    return null;
  };

  return (
    <OuterBox data-testid='navigateboxtop-component'>
      {loginUserId === postData?.user.id ? (
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
      ) : null}
      <div />
      <NavigateRight>
        {!postData?.nextPostId ? null : (
          <Previous type='button' onClick={() => navigate(`/community/${postData.nextPostId}`)}>
            <img src={arrowUp} alt='arrowUp' />
            이전글
          </Previous>
        )}
        {!postData?.prevPostId ? null : (
          <Next type='button' onClick={() => navigate(`/community/${postData.prevPostId}`)}>
            <img src={arrowDown} alt='arrowDown' />
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
  position: relative;
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
  white-space: nowrap;

  &:hover {
    cursor: pointer;
  }
`;
const DeletePost = styled.div`
  ${(props) => props.theme.variables.flex()}
  white-space: nowrap;
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
  white-space: nowrap;

  img {
    width: 14px;
    margin-right: 5px;
  }

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
  white-space: nowrap;

  img {
    width: 14px;
    margin-right: 5px;
  }

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
  white-space: nowrap;
  &:hover {
    cursor: pointer;
  }
`;
