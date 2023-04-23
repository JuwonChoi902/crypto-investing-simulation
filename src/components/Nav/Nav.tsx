import styled from 'styled-components';
import React, { useState } from 'react';
import icon from './images/mainIcon.png';
import menuLeft from './images/menuLeft.png';
import menuRight from './images/menuRight.png';

export default function Nav() {
  const [navMenuNow, setNavMenuNow] = useState<string>('0');
  return (
    <OuterBox>
      <CryptoBy>
        <img src={icon} alt='icon' />
        <span>CryptoBy</span>
      </CryptoBy>
      <NavButtonBox>
        <img src={menuLeft} alt='menuLeft' />
        <NavMenuBtn id='1' navMenuNow={navMenuNow} onClick={() => setNavMenuNow('1')}>
          구매하기
        </NavMenuBtn>
        <NavMenuBtn id='2' navMenuNow={navMenuNow} onClick={() => setNavMenuNow('2')}>
          커뮤니티
        </NavMenuBtn>
      </NavButtonBox>
      <MenuButtonBox>
        <NavLoginBtn>로그인</NavLoginBtn>
        <NavMenuBtnForRegister>회원가입</NavMenuBtnForRegister>
        <img src={menuRight} alt='menuRight' />
      </MenuButtonBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 0px 16px;
`;

const CryptoBy = styled.div`
  display: flex;
  font-size: 24px;
  font-weight: bold;
  margin-right: 10px;
  color: ${(props) => props.theme.style.yellow};

  img {
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const NavButtonBox = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 20px;
    margin: 8px;

    &:hover {
      cursor: pointer;
    }
  }
`;

const MenuButtonBox = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 16px;

  img {
    width: 20px;
    margin: 8px;

    &:hover {
      cursor: pointer;
    }
  }
`;

const NavMenuBtn = styled.div<{ id: string; navMenuNow: string }>`
  font-size: 14px;
  margin: 8px;
  color: ${(props) => (props.id === props.navMenuNow ? props.theme.style.yellow : 'black')};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;

const NavLoginBtn = styled.div`
  font-size: 14px;
  margin: 8px;

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;

const NavMenuBtnForRegister = styled.div`
  ${(props) => props.theme.variables.flex()};

  width: 93px;
  height: 32px;
  font-size: 14px;
  margin: 8px;
  border-radius: 3px;
  background-color: ${(props) => props.theme.style.buttonYellow};

  &:hover {
    cursor: pointer;
  }
`;
