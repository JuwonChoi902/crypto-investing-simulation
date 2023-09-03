import { useNavigate } from 'react-router';
import React from 'react';
import styled from 'styled-components';
import support from '../images/support.png';
import faq from '../images/faq.png';
import community from '../images/community.png';

function NeedHelp() {
  const navigate = useNavigate();
  return (
    <OuterBox data-testid='needhelp'>
      <Title>도움이 필요하세요?</Title>
      <MenuBox>
        <MenuCard>
          <ImgBox>
            <img alt='helpImg' src={support} />
          </ImgBox>
          <TextBox>
            <HelpTitle>24시간 상담 가능</HelpTitle>
            <HelpDesc>도움이 필요하시다면 24시간 대기중인 상담원이 상담해드립니다.</HelpDesc>
            <HelpLink onClick={() => alert('서비스 준비중입니다.')}>상담하기</HelpLink>
          </TextBox>
        </MenuCard>
        <MenuCard>
          <ImgBox>
            <img alt='helpImg' src={faq} />
          </ImgBox>
          <TextBox>
            <HelpTitle>자주 묻는 질문</HelpTitle>
            <HelpDesc>자주 묻는 질문에 대한 자세한 답변을 살펴보세요.</HelpDesc>
            <HelpLink onClick={() => alert('서비스 준비중입니다.')}>보러가기</HelpLink>
          </TextBox>
        </MenuCard>
        <MenuCard>
          <ImgBox>
            <img alt='helpImg' src={community} />
          </ImgBox>
          <TextBox>
            <HelpTitle>커뮤니티</HelpTitle>
            <HelpDesc>다른 사람들과 투자 정보를 공유하고 친구가 되어보세요.</HelpDesc>
            <HelpLink onClick={() => navigate('/community/list')}>방문하기</HelpLink>
          </TextBox>
        </MenuCard>
      </MenuBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  padding: 80px 24px 80px 24px;
  background-color: ${(props) => props.theme.style.backgroundGrey};
`;
const MenuBox = styled.div`
  display: flex;
`;
const Title = styled.div`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 40px;
`;
const MenuCard = styled.div`
  display: flex;
  width: 100%;
  padding: 24px;

  img {
    width: 50px;
    height: 50px;
  }
`;

const ImgBox = styled.div``;
const TextBox = styled.div`
  margin-left: 24px;
`;
const HelpTitle = styled.div`
  font-size: 20px;
  margin-bottom: 14px;
`;
const HelpDesc = styled.div`
  font-size: 14px;
  margin-bottom: 16px;
  color: ${(props) => props.theme.style.grey};
`;
const HelpLink = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.style.yellow};

  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.buttonYellow};
  }
`;

export default React.memo(NeedHelp);
