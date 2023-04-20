import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import jwtDecode from 'jwt-decode';
import present from './images/present.png';
import userImg from './images/user.png';

interface UserType {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}

export default function Login() {
  const [userInfo, setUserInfo] = useState<UserType | unknown>();

  function handleCredentialResponse(response: any) {
    const userData = jwtDecode(response.credential);
    setUserInfo(userData);
  }

  console.log(userInfo);
  useEffect(() => {
    /* global google */
    if (google)
      google.accounts.id.initialize({
        client_id: '126645320385-715mi7o4d3jrbl3m89qv3ju68ak3cepd.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });
    const $signInBtn = document.getElementById('signInBtn');
    if ($signInBtn && google)
      google.accounts.id.renderButton($signInBtn, { type: 'standard', theme: 'outline', size: 'large' });
  }, []);

  return (
    <OuterBox>
      <LoginBox>
        <Title>CryptoBy에서 가상화폐 거래를 즐겨보세요</Title>
        <LoginForm>
          <TradeForFree>
            <img src={present} alt='present' />
            <div>간편 회원가입으로 가상거래 즐기기</div>
          </TradeForFree>
          <YellowBox>
            <img src={userImg} alt='userImg' />
            <div>구글로 간편가입 후 1억을 받으세요</div>
          </YellowBox>
          <LineBox>
            <Line />
            <LineText>또는</LineText>
            <Line />
          </LineBox>
          <GoogleApple>
            <GoogleBtn id='signInBtn'>
              {/* <img src={google} alt='google' />
              <div>Google</div> */}
            </GoogleBtn>
          </GoogleApple>
        </LoginForm>
      </LoginBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  ${(props) => props.theme.variables.flex()}
  padding: 80px 24px 80px 24px;
  background-color: ${(props) => props.theme.style.backgroundGrey};
`;

const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.div`
  font-size: 40px;
  font-weight: 600;
`;
const LoginForm = styled.div`
  margin-top: 48px;
`;
const TradeForFree = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  img {
    width: 20px;
  }
`;
const YellowBox = styled.div`
  ${(props) => props.theme.variables.flex()}
  margin-top: 28px;
  font-size: 16px;
  border-radius: 4px;
  width: 384px;
  height: 48px;
  background-color: ${(props) => props.theme.style.buttonYellow};

  img {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }

  &:hover {
    background-color: #fdd950;
  }
`;
const LineBox = styled.div`
  display: flex;
  align-items: center;
  width: 384px;
  height: 56px;
  color: ${(props) => props.theme.style.grey};
`;

const LineText = styled.div`
  width: 100px;
  margin-left: 15px;
`;

const Line = styled.div`
  border: 1px solid #e9ecef;
  height: 0px;
  width: 100%;
`;
const GoogleApple = styled.div`
  width: 384px;
  display: flex;
  justify-content: center;
  img {
    width: 16px;
    margin-right: 11px;
  }
`;
const GoogleBtn = styled.div`
  ${(props) => props.theme.variables.flex()}
  font-weight: 600;
  width: 210px;
  height: 48px;
  border-radius: 4px;
  background-color: #eaecef;

  &:hover {
    cursor: pointer;
    background-color: #e9ecef;
  }
`;
