import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import RangkingBox from '../../src/pages/Community/components/otherComponents/RankingBox';

describe('RangkingBox Component', () => {
  const mockAlert = jest.fn();
  global.alert = mockAlert;

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

  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          isSuccess: true,
          data: [
            {
              id: 1,
              nickname: 'mockUser1',
              totalMoney: 100000,
              yieldPercent: 10,
              ranking: 1,
            },
            { id: 2, nickname: 'mockUser2', totalMoney: 90000, yieldPercent: 5, ranking: 2 },
          ],
        }),
    }),
  );

  test('should render components when all states are default', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <RangkingBox />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const followingComponent = screen.getByText('팔로잉');

    expect(followingComponent).toBeInTheDocument();
    fireEvent.click(followingComponent);
    expect(alert).toHaveBeenCalledWith('서비스 준비중입니다.');
  });
});
