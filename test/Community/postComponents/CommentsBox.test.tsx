import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import CommentsBox from '../../../src/pages/Community/components/postComponents/CommentsBox';
import { CommentDataType } from '../../../src/typing/types';

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

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const commentData = [
  {
    id: 1,
    comment: '댓글입니다.',
    replyId: 1,
    created_at: '2021-08-31T15:00:00.000Z',
    deleted_at: null,
    user: {
      id: 1,
      nickname: '기석',
      description: '백엔드 개발자 장기석입니다.',
      profileImage:
        'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
    },
  },
];

const makeEdgeComments = () => {
  const temp: CommentDataType[] = [];
  for (let i = 3; i <= 10003; i += 1) {
    temp.push({
      id: i,
      comment: '1만개',
      replyId: 3,
      created_at: '2021-08-31T15:00:00.000Z',
      deleted_at: null,
      user: {
        id: 1,
        nickname: '기석',
        description: '백엔드 개발자 장기석입니다.',
        profileImage:
          'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
      },
    });
  }
  return temp;
};
const commentWindowRef = { current: document.createElement('div') };
const testProps = {
  commentCount: 10,
  commentWindowRef,
  setReplying: jest.fn(),
  setMenuNow: jest.fn(),
  setProfileId: jest.fn(),
  setCommentCount: jest.fn(),
  replying: null,
};

const mockAlert = jest.fn();
global.alert = mockAlert;

const mockFetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        isSuccess: true,
        data: commentData,
      }),
  }),
);

global.fetch = mockFetch;

const mockNavigate = jest.fn();
jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

const mockParams: { [key: string]: string } = {
  id: '1',
};
const mockUseParams = jest.fn(() => mockParams);
const spyUseParams = jest.spyOn(reactRouter, 'useParams');
spyUseParams.mockImplementation(mockUseParams);

describe('CommentsBox Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    mockAlert.mockReset();
  });

  test('should render components correcty when all states are default', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <CommentsBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const makeCommentBox = screen.getByPlaceholderText('댓글을 남겨보세요.');
    expect(makeCommentBox).toBeInTheDocument();
    const commentCount = screen.getByTestId('commentCount');
    expect(commentCount).toHaveTextContent('10개');
    const postButton = screen.getByText('등록');
    expect(postButton).toHaveStyle('color:#b7b7b7');
    const postedNick = screen.getByText('기석');
    expect(postedNick).toBeInTheDocument();
    const postedText = screen.getByText('댓글입니다.');
    expect(postedText).toBeInTheDocument();
    const replyButton = screen.getByText('답글쓰기');
    expect(replyButton).toBeInTheDocument();
    const userImg = screen.getByTestId('userImg');
    expect(userImg).toBeInTheDocument();
  });

  test('should render components correctly when access token is not found', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <CommentsBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const makeCommentBox = screen.getByPlaceholderText('로그인 후 이용 가능합니다.');
    expect(makeCommentBox).toBeInTheDocument();
    expect(makeCommentBox).toHaveAttribute('disabled', '');
  });

  test('components and funcitons work correctly when user infomation is correct', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    localStorage.setItem('id', '1');
    localStorage.setItem('nickname', '기석');
    testProps.replying = 1 as any;
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <CommentsBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const makeCommentBox = screen.getByPlaceholderText('댓글을 남겨보세요.');
    expect(makeCommentBox).toBeInTheDocument();
    const editButton = screen.getByText('수정');
    expect(editButton).toBeInTheDocument();
    const deleteButon = screen.getByText('삭제');
    expect(deleteButon).toBeInTheDocument();

    const userImg = screen.getByTestId('userImg');
    fireEvent.click(userImg);
    expect(testProps.setProfileId).toHaveBeenCalledWith(1);

    const dropboxButton = screen.getByTestId('userNickForDropBox');
    fireEvent.click(dropboxButton);
    const liEliments = screen.queryAllByRole('presentation');
    expect(liEliments.length).toBe(3);

    const replyButton = screen.getByText('답글쓰기');
    expect(replyButton).toBeInTheDocument();
    fireEvent.click(replyButton);

    const replyTextArea = screen.getByPlaceholderText('기석님께 답글쓰기');
    expect(replyTextArea).toBeInTheDocument();
  });

  test('comments CRUD process', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    localStorage.setItem('id', '1');
    localStorage.setItem('nickname', '기석');
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <CommentsBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });
    const makeCommentBox = screen.getByPlaceholderText('댓글을 남겨보세요.') as HTMLTextAreaElement;
    fireEvent.change(makeCommentBox, { target: { value: 'ㅋㅋㅋ' } });
    expect(makeCommentBox.value).toBe('ㅋㅋㅋ');

    const newComment = {
      id: 2,
      comment: '댓글2',
      replyId: 2,
      created_at: '2023-08-03T15:00:00.000Z',
      deleted_at: null,
      user: {
        id: 1,
        nickname: '기석',
        description: '백엔드 개발자 장기석입니다.',
        profileImage:
          'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
      },
    };

    await act(async () => {
      const postButton = screen.getByTestId('postButton');
      mockFetch.mockReset().mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              isSuccess: true,
              data: [...commentData, newComment],
            }),
        }),
      );
      fireEvent.click(postButton);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://server.pien.kr:4000/community/reply',
      expect.objectContaining({
        body: '{"postId":"1","comment":"ㅋㅋㅋ"}',
        headers: [
          ['Content-Type', 'application/json;charset=utf-8'],
          ['Authorization', 'Bearer mock-token'],
        ],
        method: 'POST',
      }),
    );

    const reply2 = screen.getByText('댓글2');
    expect(reply2).toBeInTheDocument();

    const editButton = screen.queryAllByText('수정')[1];
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(testProps.setReplying).toHaveBeenCalledWith(null);
    const editTextArea = screen.getByTestId('editTextArea') as HTMLTextAreaElement;
    expect(editTextArea).toBeInTheDocument();
    fireEvent.change(editTextArea, { target: { value: '수정중' } });
    expect(editTextArea.value).toBe('수정중');

    await act(() => {
      const editPostButton = screen.getByTestId('editPostButton');
      newComment.comment = '수정중';
      mockFetch.mockReset().mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              isSuccess: true,
              data: [...commentData, newComment],
            }),
        }),
      );
      fireEvent.click(editPostButton);
    });

    const commentDesc = screen.queryAllByTestId('commentDesc');
    expect(commentDesc[1]).toHaveTextContent('수정중');

    const mockConfirm = jest.spyOn(window, 'confirm');
    mockConfirm.mockReturnValue(true);

    await act(() => {
      const deleteButton2 = screen.queryAllByText('삭제')[1];
      mockFetch.mockReset().mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              isSuccess: true,
              data: [...commentData],
            }),
        }),
      );
      fireEvent.click(deleteButton2);
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenLastCalledWith('https://server.pien.kr:4000/community/reply/1', {
      headers: [
        ['Content-Type', 'application/json;charset=utf-8'],
        ['Authorization', 'Bearer mock-token'],
      ],
    });
  });

  test('efficiency test when comments are over 10000', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    localStorage.setItem('id', '1');
    localStorage.setItem('nickname', '기석');
    testProps.replying = 1 as any;

    mockFetch.mockReset().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            isSuccess: true,
            data: makeEdgeComments(),
          }),
      }),
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <CommentsBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const comment = screen.queryAllByText('1만개');
    expect(comment[0]).toBeInTheDocument();
  });
});
