import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import write from '../../images/write.png';

type NavigateBoxUnderProps = {
  setPostNow: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function NavigateBoxUnder({ setPostNow }: NavigateBoxUnderProps) {
  const navigate = useNavigate();
  const loginUserToken = localStorage.getItem('accessToken');

  return (
    <OuterBox data-id='navigateboxunder-component'>
      <NaviLeft>
        <WritePost
          onClick={() => {
            if (!loginUserToken) {
              if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
                navigate('/login');
              }
            } else {
              navigate('/community/posting');
            }
          }}
        >
          <img src={write} alt='write' />
          글쓰기
        </WritePost>
        <ReplyThisPost onClick={() => alert('서비스 준비중입니다.')}>답글</ReplyThisPost>
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
    </OuterBox>
  );
}

const OuterBox = styled.div`
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
  white-space: nowrap;

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
  white-space: nowrap;

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
  white-space: nowrap;

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
  white-space: nowrap;

  &:hover {
    cursor: pointer;
  }
`;
