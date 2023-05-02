import React, { useState } from 'react';
import styled from 'styled-components';
import { Navigate, useLocation, useNavigate } from 'react-router';
import writeYellow from '../images/writeYellow.png';
import checkGrey from '../images/checkGrey.png';
import checkGreen from '../images/checkGreen.png';

export default function NickNameInput() {
  const [userInput, setUserInput] = useState<string>('');
  const [isItValid, setIsItValid] = useState<boolean>(false);
  const [isItDuplicated, setIsItDuplicated] = useState<boolean>(false);
  const [checkedString, setCheckedString] = useState<string>('');

  const navigate = useNavigate();
  const regex = /^[가-힣a-zA-Z0-9]{2,8}$/;
  const { state } = useLocation();

  const changeUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsItDuplicated(false);
    setUserInput(e.target.value);
    setIsItValid(regex.test(e.target.value));
  };

  const duplicateCheck = () => {
    if (isItValid) {
      setCheckedString(userInput);
      fetch('http://pien.kr:4000/user/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ nickname: userInput }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === true) {
            setIsItDuplicated(true);
          }
        });
    }
  };
  const submit = () => {
    if (
      window.confirm(
        `한 번 생성한 닉네임은 변경할 수 없습니다. '${checkedString}'(으)로 닉네임을 만드시겠습니까?`,
      ) === true
    ) {
      fetch(`http://pien.kr:4000/user/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ ...state, nickname: checkedString }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess === true) {
            localStorage.clear();
            localStorage.setItem('id', data.data.id);
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('nickname', data.data.nickname);
            navigate('/main');
          }
        });
    }
    return null;
  };

  return (
    <OuterBox>
      <NickNameInputForm onSubmit={(e) => e.preventDefault()}>
        <HeadText>가입을 위해 닉네임을 입력해주세요</HeadText>
        <span>(한글/숫자/영문 2~8자)</span>
        <InputOuterBox>
          <InputInnerBox isItValid={isItValid}>
            <img src={writeYellow} alt='write' />
            <NickName type='text' placeholder='닉네임을 입력해주세요' onChange={(e) => changeUserInput(e)} />
          </InputInnerBox>
          <DuplicateCheck isItValid={isItValid} onClick={duplicateCheck}>
            중복체크
          </DuplicateCheck>
          <DuplicateCheckImg>
            <img src={isItDuplicated ? checkGreen : checkGrey} alt='check' />
          </DuplicateCheckImg>
        </InputOuterBox>

        <IsItDuplicated isItDuplicated={isItDuplicated}>
          {checkedString ? (
            <div>{`'${checkedString}'은 ${
              isItDuplicated ? '사용가능한' : '사용할 수 없는'
            } 닉네임입니다.`}</div>
          ) : null}
        </IsItDuplicated>

        <SubmitButton isItDuplicated={isItDuplicated} isItValid={isItValid} onClick={submit}>
          가입하기
        </SubmitButton>
      </NickNameInputForm>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 100px;
`;

const NickNameInputForm = styled.form`
  border: 1px solid #e5e5e5;
  position: relative;
  border-radius: 6px;
  width: 500px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.style.backgroundGrey};
  span {
    font-size: 11px;
    margin-top: 20px;
  }
`;

const HeadText = styled.div`
  font-size: 16px;
  font-weight: bold;
`;
const InputOuterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0px 10px 0px;
`;

const InputInnerBox = styled.div<{ isItValid: boolean }>`
  display: flex;
  width: 250px;
  border: 1px solid ${(props) => (props.isItValid ? props.theme.style.buttonYellow : '#e5e5e5')};
  height: 35px;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  margin-right: 5px;
  img {
    width: 20px;
    height: 20px;
    margin: 0px 10px;
  }
`;

const NickName = styled.input`
  width: 230px;
  height: 30px;
  border: none;
  &:focus {
    outline: none;
  }
  &:focus ~ ${InputInnerBox} {
    border: 1px solid ${(props) => props.theme.style.buttonYellow};
  }
`;

const DuplicateCheckImg = styled.div`
  img {
    width: 20px;
    height: 20px;
    margin-left: 5px;
  }
`;

const DuplicateCheck = styled.button<{ isItValid: boolean }>`
  background-color: ${(props) => (props.isItValid ? props.theme.style.buttonYellow : '#e5e5e5')};
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  width: 65px;
  height: 30px;
  color: ${(props) => (props.isItValid ? 'black' : 'grey')};

  &:hover {
    background-color: ${(props) => (props.isItValid ? '#fdd950' : '#e5e5e5')};
    cursor: ${(props) => (props.isItValid ? 'pointer' : 'normal')};
  }
`;

const IsItDuplicated = styled.div<{ isItDuplicated: boolean }>`
  /* display: none  ; */
  font-size: 12px;
  margin-bottom: 40px;
  color: ${(props) => (props.isItDuplicated ? props.theme.style.green : props.theme.style.red)};
`;

const SubmitButton = styled.button<{ isItDuplicated: boolean; isItValid: boolean }>`
  background-color: ${(props) =>
    props.isItValid && props.isItDuplicated ? props.theme.style.buttonYellow : '#e5e5e5'};
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  width: 65px;
  height: 30px;
  position: absolute;
  bottom: 40px;
  color: ${(props) => (props.isItValid && props.isItDuplicated ? 'black' : 'grey')};

  &:hover {
    background-color: ${(props) => (props.isItValid && props.isItDuplicated ? '#fdd950' : '#e5e5e5')};
    cursor: ${(props) => (props.isItValid && props.isItDuplicated ? 'pointer' : 'normal')};
  }
`;
