import React from 'react';
import styled from 'styled-components';
import user from '../../images/userForProfile.png';

const headerText: [string, number][] = [
  ['방문', 502],
  ['작성글', 10],
  ['팔로워', 3],
];
export default function HeaderBox() {
  return (
    <OuterBox>
      <ProfilePic>
        <img src={user} alt='user' />
      </ProfilePic>
      <TextBox>
        <NickBox>
          <NickName>와이키키(qfnl****)</NickName>
          <Rank>131위</Rank>
        </NickBox>
        <Info>
          {headerText.map((el) => (
            <InfoDetail key={el[0]}>
              <DetailText>{el[0]}</DetailText>
              <DetailCount>{el[1]}</DetailCount>
            </InfoDetail>
          ))}
        </Info>
      </TextBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  display: flex;
  width: 860px;
  height: 80px;
`;

const ProfilePic = styled.div`
  position: relative;
  background-color: #e2e2e2;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border: 1px solid #d5d5d5;
  border-radius: 100%;
  margin-right: 17px;
  img {
    position: absolute;
    top: 24px;
    left: 10px;
    width: 60px;
    height: 60px;
    border-radius: 100%;
  }
`;
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const NickBox = styled.div`
  display: flex;
  margin-bottom: 10px;
`;
const NickName = styled.div`
  font-size: 24px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const Rank = styled.div`
  margin-top: 6px;
  margin-left: 6px;
  font-size: 14px;
`;
const Info = styled.div`
  font-size: 14px;
  display: flex;
`;
const InfoDetail = styled.div`
  display: flex;
  margin-right: 17px;
`;
const DetailText = styled.div`
  color: #999999;
  margin-right: 4px;
`;
const DetailCount = styled.div`
  font-weight: bold;
`;
