import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

export default function WannaRich() {
  const navigate = useNavigate();
  return (
    <OuterBox>
      <TitleBox>부자가 되고 싶으세요?</TitleBox>
      <ButtonBox>
        <button type='button' onClick={() => navigate('/login')}>
          회원가입
        </button>
      </ButtonBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  padding: 80px 0;
`;

const TitleBox = styled.div`
  ${(props) => props.theme.variables.flex()};

  font-size: 40px;
  font-weight: 600;
`;
const ButtonBox = styled.div`
  margin-top: 40px;
  ${(props) => props.theme.variables.flex()};

  button {
    ${(props) => props.theme.variables.flex()};
    width: 200px;
    height: 48px;
    background-color: ${(props) => props.theme.style.buttonYellow};
    border-radius: 4px;
    border: none;
    font-size: 16px;

    &:hover {
      cursor: pointer;
      background-color: #fcd951;
    }
  }
`;
