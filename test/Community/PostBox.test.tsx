import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import PostBox from '../../src/pages/Community/components/postComponents/PostBox';

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

describe('PostBox Component', () => {
  test('should render posts component when postNow is null', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            isSuccess: true,
            data: {
              post: [
                {
                  id: 5,
                  title: '게시글 제목',
                  description: '게시글 내용',
                  hits: 200,
                  categoryId: 1,
                  isPublished: true,
                  created_at: '2023-07-27T10:36:22.157Z',
                  repliesCount: 10,
                  user: {
                    id: 1,
                    nickname: '기석',
                    description: '백엔드 개발자 장기석입니다.',
                    profileImage:
                      'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
                  },
                },
              ],
              number: 10,
            },
          }),
      }),
    );

    const testProps = {
      setBoardNow: jest.fn(),
      setPostNow: jest.fn(),
      boardNow: 1,
      postNow: null,
      setMenuNow: jest.fn(),
      isItSearching: false,
      setIsItSearching: jest.fn(),
      setProfileId: jest.fn(),
    };

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const postComponent = screen.queryByTestId('post-component');
    expect(postComponent).not.toBeInTheDocument();

    const postsComponent = screen.getByTestId('posts-component');
    expect(postsComponent).toBeInTheDocument();
  });

  test('should render post component when postNow is not null', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              isSuccess: true,
              data: {
                id: 6,
                title: '게시글 제목',
                description: '게시글 내용',
                hits: 50,
                categoryId: 1,
                created_at: '2023-07-27T10:42:45.500Z',
                repliesCount: 20,
                isLike: true,
                likeCount: 20,
                isPublished: true,
                unLikeCount: 10,
                prevPostId: 5,
                nextPostId: 7,
                user: {
                  id: 1,
                  nickname: '기석',
                  description: '백엔드 개발자 장기석입니다.',
                  profileImage:
                    'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
                },
              },
            },
          ]),
      }),
    );

    const testProps = {
      setBoardNow: jest.fn(),
      setPostNow: jest.fn(),
      boardNow: 0,
      postNow: 49,
      setMenuNow: jest.fn(),
      isItSearching: false,
      setIsItSearching: jest.fn(),
      setProfileId: jest.fn(),
    };

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <PostBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const postComponent = screen.getByTestId('post-component');
    expect(postComponent).toBeInTheDocument();

    const postsComponent = screen.queryByTestId('posts-component');
    expect(postsComponent).not.toBeInTheDocument();
  });
});
