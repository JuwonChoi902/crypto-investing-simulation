import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import DescriptionBox from '../../../src/pages/Community/components/postComponents/DescriptionBox';
import { getPostData } from '../../../src/utils/functions';

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

const postData = {
  id: 6,
  title: '게시글 제목',
  description: '게시글 내용',
  hits: 50,
  categoryId: 1,
  created_at: '2023.07.31. 18:23',
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
};
const commentWindowRef = { current: document.createElement('div') };
const testProps = {
  commentCount: 10,
  commentWindowRef,
  postData,
  setPostData: jest.fn(),
  setPostNow: jest.fn(),
  setBoardNow: jest.fn(),
  setReplying: jest.fn(),
  setMenuNow: jest.fn(),
  setProfileId: jest.fn(),
};

const mockAlert = jest.fn();
global.alert = mockAlert;

const mockFetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        isSuccess: true,
        data: postData,
      }),
  }),
);

global.fetch = mockFetch;

const mockNavigate = jest.fn();
jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

const mockGetData = getPostData as jest.Mock;
mockGetData.mockResolvedValue([]);

const mockParams: { [key: string]: string } = {
  id: '1',
};
const mockUseParams = jest.fn(() => mockParams);
const spyUseParams = jest.spyOn(reactRouter, 'useParams');
spyUseParams.mockImplementation(mockUseParams);

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
            <DescriptionBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const label = screen.getByText('질문하기');
    expect(label).toBeInTheDocument();
    const title = screen.getByText('게시글 제목');
    expect(title).toBeInTheDocument();
    const userImages = screen.queryAllByAltText('user');
    expect(userImages.length).toBe(2);
    expect(userImages[0]).toHaveAttribute('src', postData.user.profileImage);
    const userNick = screen.queryAllByText('기석');
    expect(userNick.length).toBe(2);
    fireEvent.click(userNick[0]);
    const dropbox1 = screen.getByTestId('dropbox1');
    expect(dropbox1).toBeInTheDocument();
    const liElements = screen.queryAllByRole('presentation');
    expect(liElements.length).toBe(3);
    const date = screen.getByText('2023.07.31. 18:23');
    expect(date).toBeInTheDocument();
    const likeButton = screen.getByTestId('likeButton');
    expect(likeButton).toHaveTextContent('20');
    const dislikeButton = screen.getByTestId('dislikeButton');
    expect(dislikeButton).toHaveTextContent('10');
  });

  test('getPostData function works correctly', async () => {
    localStorage.setItem('accessToken', 'mock-token');

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <DescriptionBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    expect(mockGetData).toHaveBeenCalledTimes(2);
    expect(mockGetData).toHaveBeenCalledWith('GET', '1', undefined, undefined, expect.any(Function));
  });

  // test('coping URL function works correctly', async () => {
  //   localStorage.setItem('accessToken', 'mock-token');
  //   const mockWriteText = jest.fn();
  //   Object.assign(navigator, {
  //     clipboard: {
  //       writeText: mockWriteText,
  //     },
  //   });
  //   await act(async () => {
  //     render(
  //       <MemoryRouter>
  //         <ThemeProvider theme={{ style: theme, variables }}>
  //           <DescriptionBox {...testProps} />
  //         </ThemeProvider>
  //       </MemoryRouter>,
  //     );
  //   });

  //   const copyButton = screen.getByText('URL 복사');
  //   fireEvent.click(copyButton);

  //   expect(mockWriteText).toHaveBeenCalledWith('http://localhost/');
  // });

  test('useNavigate works correctly', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    const mockScrollTo = jest.fn();
    window.scrollTo = mockScrollTo;

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <DescriptionBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const label = screen.getByText('질문하기');
    fireEvent.click(label);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
    mockNavigate.mockReset();

    const userImgButton = screen.getByTestId('userimg');
    fireEvent.click(userImgButton);
    expect(testProps.setProfileId).toHaveBeenCalledWith(1);
    expect(testProps.setMenuNow).toHaveBeenCalledWith(2);

    const goCommentButton = screen.getByTestId('goComment');
    fireEvent.click(goCommentButton);
    expect(mockScrollTo).toHaveBeenCalledTimes(0);

    mockGetData.mockReset();

    const likeButton = screen.getByTestId('likeButtonForClick');
    fireEvent.click(likeButton);
    expect(mockGetData).toHaveBeenCalledTimes(1);
    expect(mockGetData).toBeCalledWith('DELETE', '1', undefined, undefined, expect.any(Function));

    mockGetData.mockReset();

    const dislikeButton = screen.getByTestId('dislikeButtonForClick');
    fireEvent.click(dislikeButton);
    expect(mockGetData).toHaveBeenCalledTimes(1);
    expect(mockGetData).toBeCalledWith('POST', '1', undefined, false, expect.any(Function));
  });

  test('like and dislike button works correctly', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    const mockScrollTo = jest.fn();
    window.scrollTo = mockScrollTo;

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <DescriptionBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    mockGetData.mockReset();

    const likeButton = screen.getByTestId('likeButtonForClick');
    fireEvent.click(likeButton);
    expect(mockGetData).toHaveBeenCalledTimes(1);
    expect(mockGetData).toBeCalledWith('DELETE', '1', undefined, undefined, expect.any(Function));

    mockGetData.mockReset();

    const dislikeButton = screen.getByTestId('dislikeButtonForClick');
    fireEvent.click(dislikeButton);
    expect(mockGetData).toHaveBeenCalledTimes(1);
    expect(mockGetData).toBeCalledWith('POST', '1', undefined, false, expect.any(Function));
  });
});
