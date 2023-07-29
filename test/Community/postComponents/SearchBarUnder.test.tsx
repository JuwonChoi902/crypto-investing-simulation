import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import SearchBarUnder from '../../../src/pages/Community/components/postComponents/SearchBarUnder';

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
  setPosts: jest.fn(),
  setPostNumber: jest.fn(),
  setSearchRes: jest.fn(),
  setIsItSearching: jest.fn(),
  boardNow: 0,
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

describe('SearchBarUnder Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should render components correcty when all states are default', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <SearchBarUnder {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });
  });
});
