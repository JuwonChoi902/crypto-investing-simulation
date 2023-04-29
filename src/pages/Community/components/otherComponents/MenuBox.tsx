import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import star from '../../images/star.png';

type MenuBoxProps = {
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  setIsItSearching: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
  menuNow: number;
};

export default function MenuBox({
  setMenuNow,
  setBoardNow,
  menuNow,
  setIsItSearching,
  setProfileId,
}: MenuBoxProps) {
  const navigate = useNavigate();
  const loginUserId = Number(localStorage.getItem('id'));
  const loginUserToken = localStorage.getItem('accessToken');

  return (
    <OuterBox>
      <Favorite
        id={String(0)}
        menuNow={menuNow}
        onClick={() => {
          setMenuNow(0);
          setBoardNow(null);
          setIsItSearching(false);
          navigate('/community/favorite');
        }}
      >
        <img src={star} alt='star' />
      </Favorite>
      <ShowPosts
        id={String(1)}
        menuNow={menuNow}
        onClick={() => {
          setMenuNow(1);
          setBoardNow(0);
          setIsItSearching(false);
          navigate(`/community/list`);
        }}
      >
        게시글 보기
      </ShowPosts>
      <MyPosting
        id={String(2)}
        menuNow={menuNow}
        onClick={() => {
          if (!loginUserToken) {
            if (window.confirm('로그인 후 이용가능합니다. 로그인하시겠습니까?') === true) {
              navigate('/login');
            }
          } else {
            setMenuNow(2);
            setBoardNow(null);
            setIsItSearching(false);
            setProfileId(loginUserId);
            navigate(`/community/profile`);
          }
        }}
      >
        유저페이지
      </MyPosting>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 1040px;
  display: flex;
  padding: 10px 20px;
  align-items: center;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  margin-bottom: 30px;
`;

const Favorite = styled.div<{ id: string; menuNow: number }>`
  img {
    width: 16px;
  }

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowPosts = styled.div<{ id: string; menuNow: number }>`
  padding-left: 16px;
  color: ${(props) => (Number(props.id) === props.menuNow ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const MyPosting = styled.div<{ id: string; menuNow: number }>`
  padding-left: 16px;
  color: ${(props) => (Number(props.id) === props.menuNow ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
