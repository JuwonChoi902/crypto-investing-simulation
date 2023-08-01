import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import PostList from '../../../src/pages/Community/components/postComponents/PostList';
import { getPostListData } from '../../../src/utils/functions';

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

jest.mock('../../../src/utils/functions');

const unprocessedPostData = [
  {
    id: 5,
    title: '게시글 제목',
    description: '게시글 내용',
    hits: 200,
    categoryId: 1,
    isPublished: true,
    created_at: '2023-07-27T11:26:24.524Z',
    repliesCount: 10,
    user: {
      id: 1,
      nickname: '기석',
      description: '백엔드 개발자 장기석입니다.',
      profileImage:
        'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
    },
  },
];

const testProps = {
  setPosts: jest.fn(),
  setBoardNow: jest.fn(),
  setProfileId: jest.fn(),
  setMenuNow: jest.fn(),
  setPostNumber: jest.fn(),
  setPage: jest.fn(),
  setSearchRes: jest.fn(),
  setIsItSearching: jest.fn(),
  searchRes: { stringRes: '', filterRes: '', boardRes: 0 },
  isItSearching: false,
  boardNow: 1,
  page: 1,
  posts: unprocessedPostData,
};

const mockAlert = jest.fn();
global.alert = mockAlert;

const mockFetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        isSuccess: true,
        data: {
          post: unprocessedPostData,
          number: 20,
        },
      }),
  }),
);

global.fetch = mockFetch;

const mockNavigate = jest.fn();
jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

describe('PostList Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    mockAlert.mockReset();
  });

  test('should render components correcty when all states are default', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostList {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const label = screen.getByText('질문');
    expect(label).toBeInTheDocument();
    const title = screen.getByText('게시글 제목');
    expect(title).toBeInTheDocument();
    const nickname = screen.getByText('기석');
    expect(nickname).toBeInTheDocument();
    const hits = screen.getByText('200');
    expect(hits).toBeInTheDocument();
  });

  test('should render empty components when data is empty', async () => {
    const testPropsForEmptyData = { ...testProps, posts: [] };
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostList {...testPropsForEmptyData} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const emptyList = screen.getByText('등록된 게시글이 없습니다.');
    expect(emptyList).toBeInTheDocument();
  });

  test('dropBox works correctly', async () => {
    localStorage.setItem('accessToken', 'mock-token');

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostList {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const nickname = screen.getByText('기석');
    fireEvent.click(nickname);
    const dropbox = screen.getByTestId('dropbox');
    expect(dropbox).toBeInTheDocument();
    const liElements = screen.queryAllByRole('presentation');
    expect(liElements.length).toBe(3);
    fireEvent.click(liElements[1]);
    expect(mockAlert).toHaveBeenCalledWith('서비스 준비중입니다.');
    fireEvent.click(liElements[0]);
    expect(testProps.setProfileId).toHaveBeenCalledTimes(1);
    expect(testProps.setProfileId).toHaveBeenCalledWith(1);
    expect(testProps.setMenuNow).toHaveBeenCalledTimes(1);
    expect(testProps.setMenuNow).toHaveBeenCalledWith(2);
  });

  test('navigate works correctly', async () => {
    localStorage.setItem('accessToken', 'mock-token');

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostList {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const label = screen.getByText('질문');
    fireEvent.click(label);
    expect(testProps.setBoardNow).toHaveBeenCalledTimes(1);
    expect(testProps.setBoardNow).toHaveBeenCalledWith(1);
    expect(testProps.setIsItSearching).toHaveBeenCalledWith(false);

    const title = screen.getByText('게시글 제목');
    fireEvent.click(title);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/community/5',
      expect.objectContaining({
        state: {
          currentIndex: 0,
          posts: unprocessedPostData,
        },
      }),
    );
  });

  test('getting data with useEffect works correctly', async () => {
    localStorage.setItem('accesToken', 'mockToken');

    const mockGetList = getPostListData as jest.Mock;
    mockGetList.mockResolvedValue([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostList {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });
    expect(mockGetList).toHaveBeenCalledTimes(10);

    testProps.page = 2;

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostList {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    testProps.boardNow = 2;

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostList {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    testProps.isItSearching = true;

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostList {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    expect(mockGetList).toHaveBeenCalledTimes(15);
  });
});
