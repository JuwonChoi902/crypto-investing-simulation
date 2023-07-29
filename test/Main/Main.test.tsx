import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import Main from '../../src/pages/Main/Main';

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({ isSuccess: true, data: { count: 10 } }),
  }),
);

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

describe('Main component', () => {
  test('should render BillBoard, Popular, NeedHelp, and WannaRich components', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Main />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const billBoardComponent = screen.getByTestId('billboard');
    expect(billBoardComponent).toBeInTheDocument();

    const popularComponent = screen.getByTestId('popular');
    expect(popularComponent).toBeInTheDocument();

    const needHelpComponent = screen.getByTestId('needhelp');
    expect(needHelpComponent).toBeInTheDocument();

    const wannaRichComponent = screen.getByTestId('wannarich');
    expect(wannaRichComponent).toBeInTheDocument();
  });

  test('should not render WannaRich component with loginUserToken', async () => {
    localStorage.setItem('accessToken', 'dummy_token');
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Main />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const wannaRichComponent = screen.queryByTestId('wannarich');
    expect(wannaRichComponent).not.toBeInTheDocument();
  });
});
