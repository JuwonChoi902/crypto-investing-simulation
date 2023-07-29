import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import icon from './images/mainIcon.png';
import menuLeft from './images/menuLeft.png';
import menuYellow from './images/menuYellow.png';
import menuRight from './images/menuRight.png';
import user from './images/user.png';

export default function Nav() {
  const [menuColor, setMenuColor] = useState<boolean>(false);
  const [userId, setUserId] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setUserId(true);
    } else {
      setUserId(false);
    }
  }, [localStorage.getItem('accessToken')]);

  return (
    <OuterBox>
      <CryptoBy onClick={() => navigate('/')}>
        <img src={icon} alt='icon' />
        <span>CryptoBy</span>
      </CryptoBy>
      <NavButtonBox>
        <NavButtonImgBox
          data-testid='yellowbutton-component'
          onMouseOver={() => setMenuColor(true)}
          onMouseOut={() => setMenuColor(false)}
        >
          {menuColor ? <img src={menuYellow} alt='menuYellow' /> : <img src={menuLeft} alt='menuLeft' />}
        </NavButtonImgBox>
        <NavMenuBtn
          onClick={() => {
            navigate('/market');
          }}
        >
          구매하기
        </NavMenuBtn>
        <NavMenuBtn
          onClick={() => {
            navigate('/community/list');
          }}
        >
          커뮤니티
        </NavMenuBtn>
      </NavButtonBox>
      <MenuButtonBox>
        {userId ? (
          <NavLogoutBtn
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
          >
            로그아웃
          </NavLogoutBtn>
        ) : (
          <NavLoginBtn
            onClick={() => {
              navigate('/login');
            }}
          >
            로그인
          </NavLoginBtn>
        )}
        {userId ? (
          <UserImgBox>
            <img src={user} alt='user' />
          </UserImgBox>
        ) : (
          <NavMenuBtnForRegister onClick={() => navigate('/login')}>회원가입</NavMenuBtnForRegister>
        )}

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
  }

  &:hover {
    cursor: pointer;
  }
`;

const NavButtonImgBox = styled.div``;

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

const NavMenuBtn = styled.div`
  font-size: 14px;
  margin: 8px;

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

const NavLogoutBtn = styled.div`
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

const UserImgBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 3px;
  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    cursor: pointer;
  }
`;
