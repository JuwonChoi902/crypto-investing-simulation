import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import styled from 'styled-components';
import { makeHeaders } from '../../../../utils/functions';

export default function Posting() {
  const location = useLocation().state;
  const loginUserToken = localStorage.getItem('accessToken');
  window.scrollTo(0, 0);

  const editingData = location ? location.postData : null;
  const memoizedMakeHeaders = useCallback(makeHeaders, []);

  const [userInput, setUserInput] = useState({
    title: '',
    description: '',
    categoryId: 0,
  });

  useEffect(() => {
    if (editingData) {
      setUserInput({
        ...userInput,
        title: editingData.title,
        categoryId: editingData.categoryId,
        description: editingData.description,
      });
    }
  }, []);

  const { title, description, categoryId } = userInput;

  const navigate = useNavigate();

  const postThis = () => {
    if (!loginUserToken) {
      if (window.confirm('로그인 후 이용가능합니다. 로그인 하시겠습니까?') === true) {
        navigate('/login');
      }
    } else {
      if (title.length < 2 || description.length < 2) {
        alert('제목과 내용은 2글자 이상이어야 합니다.');
      }
      if (categoryId === 0) {
        alert('라벨을 선택하세요');
      }
      if (title.length >= 2 && description.length >= 2 && categoryId !== 0) {
        const headers = memoizedMakeHeaders(loginUserToken);
        if (editingData) {
          fetch(`https://server.pien.kr:4000/community/${editingData.id}`, {
            method: 'PATCH',
            headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
            body: JSON.stringify(userInput),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.isSuccess === true) {
                navigate(`/community/${data.data.postId}`);
              }
            });
        } else {
          fetch(`https://server.pien.kr:4000/community/`, {
            method: 'POST',
            headers: Object.entries(headers).map(([key, value]) => [key, value || '']),
            body: JSON.stringify(userInput),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.isSuccess === true) {
                navigate(`/community/${data.data.postId}`);
              }
            });
        }
      }
    }
  };

  const makingUserInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (event.target.name === 'title' || event.target.name === 'description') {
      const inputTable = {
        title: {
          name: '제목',
          limit: 60,
        },
        description: {
          name: '본문',
          limit: 3000,
        },
      };

      const fieldName = event.target.name as keyof typeof inputTable;
      const field = inputTable[fieldName];

      const textLength = event.target.value.length;

      if (textLength >= field.limit) {
        alert(`${field.name}은 ${field.limit}자 이내로 입력해주세요.`);
      } else {
        setUserInput({ ...userInput, [fieldName]: event.target.value });
      }
    } else {
      setUserInput({ ...userInput, [event.target.name]: event.target.value });
    }
  };

  return (
    <OuterBox data-testid='posting-component' onSubmit={(e) => e.preventDefault()}>
      <HeaderBox>
        <h1>게시판 글쓰기</h1>
        <button type='button' onClick={postThis}>
          {editingData ? '수정' : '등록'}
        </button>
      </HeaderBox>
      <PostingBox>
        <TitleBox optionColor={categoryId}>
          <InputBox>
            <input
              name='title'
              data-testid='titleInput'
              onChange={(e) => makingUserInput(e)}
              placeholder='제목을 입력하세요.'
              value={title}
            />
          </InputBox>
          <CategorySelect
            data-testid='labelInput'
            name='categoryId'
            onChange={makingUserInput}
            required
            value={categoryId}
          >
            <option value={0} disabled>
              게시판을 선택하세요.
            </option>
            <option value={1}>질문</option>
            <option value={2}>자랑</option>
            <option value={3}>공유</option>
            <option value={4}>잡담</option>
          </CategorySelect>
        </TitleBox>
        <Description>
          <textarea
            name='description'
            onChange={(e) => makingUserInput(e)}
            placeholder='내용을 입력하세요.'
            value={description}
          />
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
  white-space: nowrap;

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
    white-space: nowrap;

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
const TitleBox = styled.div<{ optionColor: number }>`
  display: flex;

  select {
    width: 218px;
    height: 40px;
    border: 1px solid #e5e5e5;
    padding-left: 11px;
    color: #8e8e8e;
    white-space: nowrap;

    &:focus {
      outline: none;
    }
  }
`;

const CategorySelect = styled.select`
  width: 218px;
  height: 40px;
  border: 1px solid #e5e5e5;
  padding-left: 11px;
  color: #8e8e8e;
  white-space: nowrap;

  &:focus {
    outline: none;
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
