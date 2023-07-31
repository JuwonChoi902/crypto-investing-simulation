import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import Posting from '../../../src/pages/Community/components/postComponents/Posting';

const mockLocalStorage = {
  store: {} as { [key: string]: string },
  getItem(key: string) {
    return this.store[key];
  },
  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  },
  clear() {
    this.store = {};
  },
};

const mockNavigate = jest.fn();
jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

const mockScrollTo = jest.fn();
window.scrollTo = mockScrollTo;

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const mockLocation = {
  key: 'mockKey',
  pathname: '/mockPath',
  search: '?mockQuery=1',
  hash: '#mockHash',
  state: null,
};

jest.spyOn(reactRouter, 'useLocation').mockReturnValue(mockLocation);

describe('Posting Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockLocation.state = null;
  });

  test('should render components when all states are default', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posting />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const title = screen.getByText('게시판 글쓰기');
    const titleInputBox = screen.getByTestId('titleInput') as HTMLInputElement;
    const descriptionInputBox = screen.getByPlaceholderText('내용을 입력하세요.');
    const labelInputbox = screen.getByText('게시판을 선택하세요.');
    const postButton = screen.getByText('등록');

    expect(title).toBeInTheDocument();
    expect(titleInputBox).toBeInTheDocument();
    expect(descriptionInputBox).toBeInTheDocument();
    expect(labelInputbox).toBeInTheDocument();
    expect(postButton).toBeInTheDocument();
  });

  test('should render post data when it is editing', async () => {
    mockLocation.state = { postData: { title: '테스팅중', description: 'ㅇㅇ', categoryId: 1 } } as any;

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posting />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const titleInputBox = screen.getByPlaceholderText('제목을 입력하세요.') as HTMLInputElement;
    const descriptionInputBox = screen.getByPlaceholderText('내용을 입력하세요.') as HTMLTextAreaElement;
    const labelInputbox = screen.getByText('질문');
    const postButton = screen.getByText('수정');

    expect(titleInputBox.value).toBe('테스팅중');
    expect(descriptionInputBox.value).toBe('ㅇㅇ');
    expect(labelInputbox).toBeInTheDocument();
    expect(postButton).toBeInTheDocument();
  });

  test('maximum input limit works correctly', async () => {
    const mockAlert = jest.fn();
    global.alert = mockAlert;

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posting />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const titleInputBox = screen.getByPlaceholderText('제목을 입력하세요.') as HTMLInputElement;
    fireEvent.change(titleInputBox, { target: { value: 's'.repeat(60) } });
    expect(mockAlert).toHaveBeenCalledTimes(1);
    expect(mockAlert).toHaveBeenCalledWith('제목은 60자 이내로 입력해주세요.');
    mockAlert.mockReset();

    const descriptionInputBox = screen.getByPlaceholderText('내용을 입력하세요.') as HTMLTextAreaElement;
    fireEvent.change(descriptionInputBox, { target: { value: 't'.repeat(3000) } });
    expect(mockAlert).toHaveBeenCalledWith('본문은 3000자 이내로 입력해주세요.');
  });

  test('posting process works correctly', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    const fetchMock = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            isSuccess: true,
            data: {
              postId: 1,
            },
          }),
      }),
    );

    global.fetch = fetchMock;

    const mockAlert = jest.fn();
    global.alert = mockAlert;

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posting />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const titleInputBox = screen.getByPlaceholderText('제목을 입력하세요.') as HTMLInputElement;
    fireEvent.change(titleInputBox, { target: { value: 'test' } });
    expect(titleInputBox.value).toBe('test');
    const descriptionInputBox = screen.getByPlaceholderText('내용을 입력하세요.') as HTMLTextAreaElement;
    fireEvent.change(descriptionInputBox, { target: { value: 'test' } });
    expect(descriptionInputBox.value).toBe('test');
    const labelInputbox = screen.getByTestId('labelInput') as HTMLSelectElement;
    fireEvent.change(labelInputbox, { target: { value: '1' } });
    expect(labelInputbox.value).toBe('1');
    const postButton = screen.getByText('등록');
    fireEvent.click(postButton);
    expect(mockAlert).toHaveBeenCalledTimes(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://server.pien.kr:4000/community/',
      expect.objectContaining({
        method: 'POST',
        headers: [
          ['Content-Type', 'application/json;charset=utf-8'],
          ['Authorization', 'Bearer mock-token'],
        ],
        body: JSON.stringify({
          title: 'test',
          description: 'test',
          categoryId: '1',
        }),
      }),
    );
  });
});
