import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import Posts from '../../src/pages/Community/components/postComponents/Posts';

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

const testProps = {
  boardNow: 0,
  setBoardNow: jest.fn(),
  isItSearching: false,
  setIsItSearching: jest.fn(),
  setProfileId: jest.fn(),
  setMenuNow: jest.fn(),
};

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
          ],
          number: 20,
        },
      }),
  }),
);

const mockNavigate = jest.fn();
jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

describe('Posts Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should render components correcty when all states are default', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posts {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const searchBarTopComponent = screen.queryByTestId('searchbartop-component');
    const searchBarUnderComponent = screen.getByTestId('searchbarunder-component');
    const whatIsListComponent = screen.getByTestId('whatislist-component');
    const howManyPostComponent = screen.getByText('20개의 글');
    const postListComponent = screen.getByTestId('postlist-component');

    expect(searchBarTopComponent).not.toBeInTheDocument();
    expect(searchBarUnderComponent).toBeInTheDocument();
    expect(whatIsListComponent).toBeInTheDocument();
    expect(howManyPostComponent).toBeInTheDocument();
    expect(postListComponent).toBeInTheDocument();
  });

  test('should render components correcty when states are not default', async () => {
    const testPropsChanged = { ...testProps, boardNow: 1, isItSearching: true };

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posts {...testPropsChanged} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const searchBarTopComponent = screen.getByTestId('searchbartop-component');
    const searchBarUnderComponent = screen.getByTestId('searchbarunder-component');
    const whatIsListComponent = screen.queryByTestId('whatislist-component');
    const postListComponent = screen.getByTestId('postlist-component');

    expect(searchBarTopComponent).toBeInTheDocument();
    expect(searchBarUnderComponent).toBeInTheDocument();
    expect(whatIsListComponent).not.toBeInTheDocument();
    expect(postListComponent).toBeInTheDocument();
  });

  test('should render post title and username correctly', async () => {
    const testProps = {
      boardNow: 0,
      setBoardNow: jest.fn(),
      isItSearching: false,
      setIsItSearching: jest.fn(),
      setProfileId: jest.fn(),
      setMenuNow: jest.fn(),
    };

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posts {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const postTitleComponent = screen.getByText('게시글 제목');
    expect(postTitleComponent).toBeInTheDocument();

    const postUserNameComponent = screen.getByText('기석');
    expect(postUserNameComponent).toBeInTheDocument();
  });

  test('should render page components number correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posts {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const pageComponents = screen.getAllByTestId('page-component');
    expect(pageComponents.length).toBe(2);
  });

  test('useNavigate to Posting is up and running when user token is found', async () => {
    localStorage.setItem('accessToken', 'dummy_token');

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posts {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const buttonElement = screen.getByText('글 작성하기');
    fireEvent.click(buttonElement);
    expect(mockNavigate).toHaveBeenCalledWith('/community/posting');
  });

  test('useNavigate to Posting is up and running when user token is not found', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockReturnValue(false);

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Posts {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });
    const buttonElement = screen.getByText('글 작성하기');
    fireEvent.click(buttonElement);
    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(confirmSpy).toHaveBeenCalledWith('로그인 후 이용가능합니다. 로그인 하시겠습니까?');

    confirmSpy.mockRestore();
  });
});
