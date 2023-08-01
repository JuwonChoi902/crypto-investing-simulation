import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import CommentsBox from '../../../src/pages/Community/components/postComponents/CommentsBox';

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
});
