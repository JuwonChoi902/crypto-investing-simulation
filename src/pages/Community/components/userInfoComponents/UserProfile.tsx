import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import user from '../../images/userForProfile.png';
import { HeadersType, UserDataType } from '../../../../typing/types';

type UserProfileProps = {
  profileId: number | null | undefined;
};

export default function UserProfile({ profileId }: UserProfileProps) {
  const [userData, setUserData] = useState<UserDataType>();
  const loginUserToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const headers: HeadersType = {
      'Content-Type': 'application/json;charset=utf-8',
    };

    if (loginUserToken) {
      headers.Authorization = `Bearer ${loginUserToken}`;
    } else {
      delete headers.Authorization;
    }

    fetch(`https://server.pien.kr:4000/user/${profileId}`, {
      headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isSuccess) {
          setUserData(data.data);
        }
      });
  }, []);

  const headerText: [string, number | undefined][] = [
    ['작성글', userData?.publishedPost],
    ['작성댓글', userData?.publishedReply],
    ['팔로워', 0],
  ];

  return (
    <OuterBox>
      <ProfilePic userImg={userData?.profileImage}>
        <img src={userData?.profileImage || user} alt='user' />
      </ProfilePic>
      <TextBox>
        <NickBox>
          <NickName>
            {userData?.nickname}({`${userData?.email?.slice(0, 4)}****`})
          </NickName>
          <Rank>{userData?.ranking}위</Rank>
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
  white-space: nowrap;
`;

const ProfilePic = styled.div<{ userImg: string | undefined }>`
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
    top: ${(props) => (props.userImg ? '0px' : '24px')};
    left: ${(props) => (props.userImg ? '0px' : '10px')};
    width: ${(props) => (props.userImg ? '80px' : '60px')};
    height: ${(props) => (props.userImg ? '80px' : '60px')};
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
