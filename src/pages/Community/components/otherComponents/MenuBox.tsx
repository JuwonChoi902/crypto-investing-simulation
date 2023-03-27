import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import star from '../../images/star.png';

type MenuBoxProps = {
  setMenuNow: React.Dispatch<React.SetStateAction<number>>;
  setBoardNow: React.Dispatch<React.SetStateAction<number | null>>;
  menuNow: number;
};

export default function MenuBox({ setMenuNow, setBoardNow, menuNow }: MenuBoxProps) {
  const navigate = useNavigate();

  return (
    <OuterBox>
      <Favorite id={1} menuNow={menuNow} onClick={() => setMenuNow(1)}>
        <img src={star} alt='star' />
      </Favorite>
      <ShowPosts
        id={2}
        menuNow={menuNow}
        onClick={() => {
          setMenuNow(2);
          setBoardNow(0);
          navigate(`/community/list`);
        }}
      >
        게시글 보기
      </ShowPosts>
      <MyPosting
        id={3}
        menuNow={menuNow}
        onClick={() => {
          setMenuNow(3);
          setBoardNow(null);
          navigate(`/community/profile`);
        }}
      >
        마이페이지
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

const Favorite = styled.div<{ id: any; menuNow: number }>`
  img {
    width: 16px;
  }

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowPosts = styled.div<{ id: any; menuNow: number }>`
  padding-left: 16px;
  color: ${(props) => (props.id === props.menuNow ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const MyPosting = styled.div<{ id: any; menuNow: number }>`
  padding-left: 16px;
  color: ${(props) => (props.id === props.menuNow ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
