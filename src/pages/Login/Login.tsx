import React from 'react';
import styled from 'styled-components';
import present from './images/present.png';
import user from './images/user.png';
import google from './images/google.png';
import apple from './images/apple.png';

export default function Login() {
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
            <img src={user} alt='user' />
            <div>이메일 또는 휴대폰번호로 가입하기</div>
          </YellowBox>
          <LineBox>
            <Line />
            <LineText>또는</LineText>
            <Line />
          </LineBox>
          <GoogleApple>
            <GoogleBtn>
              {/* <img src={google} alt='google' />
              <div>Google</div> */}
              <div
                id='g_id_onload'
                data-client_id='126645320385-715mi7o4d3jrbl3m89qv3ju68ak3cepd.apps.googleusercontent.com'
                data-context='signup'
                data-ux_mode='redirect'
                data-login_uri='http://localhost:3000/login'
                data-auto_prompt='false'
              />

              <div
                className='g_id_signin'
                data-type='standard'
                data-shape='rectangular'
                data-theme='outline'
                data-text='signup_with'
                data-size='large'
                data-locale='ko'
                data-logo_alignment='left'
              />
            </GoogleBtn>
            <AppleBtn>
              <img src={apple} alt='apple' />
              <div>Apple</div>
            </AppleBtn>
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
    cursor: pointer;
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
  justify-content: space-between;

  img {
    width: 16px;
    margin-right: 11px;
  }
`;
const GoogleBtn = styled.div`
  ${(props) => props.theme.variables.flex()}
  font-weight: 600;
  width: 180px;
  height: 48px;
  border-radius: 4px;
  background-color: #eaecef;

  &:hover {
    cursor: pointer;
    background-color: #e9ecef;
  }
`;
const AppleBtn = styled.div`
  ${(props) => props.theme.variables.flex()}
  font-weight:600;
  width: 180px;
  height: 48px;
  border-radius: 4px;
  background-color: #eaecef;
  &:hover {
    cursor: pointer;
    background-color: #e9ecef;
  }
`;
