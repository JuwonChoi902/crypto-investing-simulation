import React, { useState } from 'react';
import styled from 'styled-components';

export default function Posting() {
  const [userInput, setUserInput] = useState();
  return (
    <OuterBox>
      <HeaderBox>
        <h1>게시판 글쓰기</h1>
        <button type='button'>등록</button>
      </HeaderBox>
      <PostingBox>
        <TitleBox>
          <InputBox>
            <input name='title' placeholder='제목을 입력하세요.' />
          </InputBox>
          <select name='label' required>
            <option value='' disabled selected>
              라벨을 선택하세요.
            </option>
            <option value='질문'>질문</option>
            <option value='자랑'>자랑</option>
            <option value='공유'>공유</option>
          </select>
        </TitleBox>
        <Description>
          <textarea name='description' placeholder='내용을 입력하세요.' />
        </Description>
      </PostingBox>
    </OuterBox>
  );
}

const OuterBox = styled.form`
  display: flex;
  padding: 100px 0;
  flex-direction: column;
  align-items: center;
`;
const HeaderBox = styled.div`
  width: 865px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid black;

  h1 {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
  }

  button {
    ${(props) => props.theme.variables.flex()}
    width: 46px;
    height: 36px;
    background-color: #f9f9fa;
    border-radius: 4px;
    border: none;

    &:hover {
      cursor: pointer;
      background-color: ${(props) => props.theme.style.buttonYellow};
      color: white;
    }
  }
`;
const PostingBox = styled.div`
  width: 865px;
  padding-top: 12px;
`;
const TitleBox = styled.div`
  display: flex;

  select {
    width: 218px;
    height: 40px;
    border: 1px solid #e5e5e5;
    padding-left: 11px;
    color: #8e8e8e;

    &:focus {
      outline: none;
    }
  }
`;
const InputBox = styled.div`
  input {
    width: 592px;
    height: 38px;
    padding: 0 25px 0 11px;
    border: 1px solid #e5e5e5;
    margin-right: 16px;

    &:focus {
      outline: none;
    }
  }
`;
const Description = styled.div`
  width: 762px;
  height: 412px;
  border: 1px solid #e5e5e5;
  padding: 70px 50px;
  margin-top: 16px;

  textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;

    &:focus {
      outline: none;
    }
  }
`;
