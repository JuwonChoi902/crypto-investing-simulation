import React from 'react';
import styled from 'styled-components';
import discord from './images/discord.png';
import instagram from './images/instagram.png';
import youtube from './images/youtube.png';

export default function Footer() {
  return (
    <OuterBox>
      <MenuOuterBox>
        <FooterMenuBox>
          <FooterMenuTitle>About Us</FooterMenuTitle>
          {AboutUs.map((el) => (
            <FooterMenu key={el.id}>{el.name}</FooterMenu>
          ))}
        </FooterMenuBox>
        <FooterMenuBox>
          <FooterMenuTitle>Service</FooterMenuTitle>
          {Service.map((el) => (
            <FooterMenu key={el.id}>{el.name}</FooterMenu>
          ))}
        </FooterMenuBox>
        <FooterMenuBox>
          <FooterMenuTitle>Learn</FooterMenuTitle>
          {Learn.map((el) => (
            <FooterMenu key={el.id}>{el.name}</FooterMenu>
          ))}
        </FooterMenuBox>
      </MenuOuterBox>
      <CommunityBox>
        <span>Community</span>
        <img alt='instagram' src={instagram} />
        <img alt='discord' src={discord} />
        <img alt='youtube' src={youtube} />
      </CommunityBox>
      <LogoBox>
        <div>CryptoBy ⓒ 2022</div>
      </LogoBox>
    </OuterBox>
  );
}
const OuterBox = styled.div`
  margin-top: 200px;
  padding: 0px 20px;
  bottom: 0;
`;

const MenuOuterBox = styled.div`
  display: flex;
  justify-content: center;
`;
const FooterMenuBox = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterMenuTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 12px;
`;

const FooterMenu = styled.div`
  height: 16px;
  font-size: 15px;
  margin-bottom: 12px;
  color: ${(props) => props.theme.style.grey};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;

const CommunityBox = styled.div`
  height: 55px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;

  span {
    font-size: 20px;
    font-weight: 600;
    margin-right: 20px;
  }

  img {
    width: 20px;
    opacity: 0.4;
    margin: 15px;

    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  }
`;

const LogoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${(props) => props.theme.style.grey};
  height: 55px;
  font-size: 14px;

  div {
    display: flex;
    justify-content: center;
    font-weight: 600;
  }
`;

interface FooterDater {
  id: number;
  name: string;
  url: string;
}

const AboutUs: FooterDater[] = [
  { id: 1, name: 'contact', url: 'www.naver.com' },
  { id: 2, name: 'notice', url: 'www.naver.com' },
];

const Service: FooterDater[] = [
  { id: 1, name: '구매하기', url: 'www.naver.com' },
  { id: 2, name: '커뮤니티', url: 'www.naver.com' },
  { id: 3, name: '내지갑', url: 'www.naver.com' },
];

const Learn: FooterDater[] = [{ id: 1, name: '이용방법', url: 'www.naver.com' }];

const Community: FooterDater[] = [
  { id: 1, name: 'Youtube', url: 'www.youtube.com' },
  { id: 2, name: 'Instagram', url: 'www.instagram.com' },
  { id: 3, name: 'discord', url: 'www.discord.com' },
];
