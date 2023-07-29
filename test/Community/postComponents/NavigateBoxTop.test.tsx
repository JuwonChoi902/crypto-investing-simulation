import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import NavigateBoxTop from '../../../src/pages/Community/components/postComponents/NavigateBoxTop';

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

const mockNavigate = jest.fn();
jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

describe('NavigateUnder Component', () => {
  const testProps = {
    setPostNow: jest.fn(),
    postData: {
      id: 6,
      title: '게시글 제목',
      description: '게시글 내용',
      hits: 50,
      categoryId: 1,
      created_at: '2023-07-29T08:10:41.183Z',
      repliesCount: 20,
      isLike: true,
      likeCount: 20,
      isPublished: true,
      unLikeCount: 10,
      prevPostId: 3,
      nextPostId: 7,
      user: {
        id: 1,
        nickname: '기석',
        description: '백엔드 개발자 장기석입니다.',
        profileImage:
          'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
      },
    },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  test('should not render leftBox when the id is not matched', async () => {
    localStorage.setItem('id', '2');
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <NavigateBoxTop {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const leftBox = screen.queryByTestId('leftBox');
    expect(leftBox).not.toBeInTheDocument();
  });

  test('should render leftBox when the id is matched', async () => {
    localStorage.setItem('id', '1');
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <NavigateBoxTop {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const leftBox = screen.getByTestId('leftBox');
    expect(leftBox).toBeInTheDocument();
  });

  test('prev button should render depending on post data', async () => {
    localStorage.setItem('id', '1');

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <NavigateBoxTop {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const prevButton = screen.getByText('이전글');
    expect(prevButton).toBeInTheDocument();
  });

  test('prev button should not render depending on post data', async () => {
    localStorage.setItem('id', '1');

    const testProps2 = {
      setPostNow: jest.fn(),
      postData: {
        id: 6,
        title: '게시글 제목',
        description: '게시글 내용',
        hits: 50,
        categoryId: 1,
        created_at: '2023-07-29T08:10:41.183Z',
        repliesCount: 20,
        isLike: true,
        likeCount: 20,
        isPublished: true,
        unLikeCount: 10,
        prevPostId: 40,
        nextPostId: null,
        user: {
          id: 1,
          nickname: '기석',
          description: '백엔드 개발자 장기석입니다.',
          profileImage:
            'https://velog.velcdn.com/images/kisuk623/profile/8dc78e6c-5544-4b8a-8ebe-1ecd9dcb14fd/image.png',
        },
      },
    };

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <NavigateBoxTop {...testProps2} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const prevButton = screen.queryByTestId('prevButton');
    expect(prevButton).not.toBeInTheDocument();
  });

  test('list button should work correctly', async () => {
    localStorage.setItem('id', '1');

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <NavigateBoxTop {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const listButton = screen.getByText('목록');
    fireEvent.click(listButton);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
    expect(testProps.setPostNow).toBeCalledWith(null);
  });
});
