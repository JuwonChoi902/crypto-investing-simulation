import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import Post from '../../../src/pages/Community/components/postComponents/Post';

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

const unprocessedPostData = {
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
};

jest.mock('../../../src/utils/functions');

const testProps = {
  setPostNow: jest.fn(),
  setBoardNow: jest.fn(),
  setMenuNow: jest.fn(),
  setProfileId: jest.fn(),
};

const mockAlert = jest.fn();
global.alert = mockAlert;

const mockFetch = jest.fn().mockImplementation((url) => {
  if (url === 'https://server.pien.kr:4000/community/1') {
    Promise.resolve({
      json: () =>
        Promise.resolve({
          isSuccess: true,
          data: {
            id: 6,
            title: '게시글 제목',
            description: '게시글 내용',
            hits: 50,
            categoryId: 1,
            created_at: '2023-08-01T08:02:27.805Z',
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
        }),
    });
  } else {
    Promise.resolve({
      json: () =>
        Promise.resolve({
          isSuccess: true,
          data: [
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
          ],
        }),
    });
  }
});

global.fetch = mockFetch;

const mockParams: { [key: string]: string } = {
  id: '1',
};

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => mockParams);
jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

const spyUseParams = jest.spyOn(reactRouter, 'useParams');
spyUseParams.mockImplementation(mockUseParams);

describe('PostBox Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    mockAlert.mockReset();
  });

  test('should render components correctly when all states are default', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Post {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });
    const ss = mockUseParams().id;
    expect(ss).toBe(1);

    const naviTopComponent = screen.getByTestId('navigateboxtop-component');
    const descriptionComponent = screen.getByTestId('descriptionbox-component');
    const commentsComponent = screen.getByTestId('commentsbox-component');
    const naviunderComponent = screen.getByTestId('navigateunder-component');
    expect(naviTopComponent).not.toBeInTheDocument();
    expect(descriptionComponent).not.toBeInTheDocument();
    expect(commentsComponent).not.toBeInTheDocument();
    expect(naviunderComponent).not.toBeInTheDocument();
  });
});
