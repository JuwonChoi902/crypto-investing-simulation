import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import NavigateBoxUnder from '../../../src/pages/Community/components/postComponents/NavigateBoxUnder';

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

describe('NavigateUnder Component', () => {
  const testProps = {
    setPostNow: jest.fn(),
  };

  const mockNavigate = jest.fn();
  jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

  test('should render writeBox component', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <NavigateBoxUnder {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const writeButton = screen.getByText('글쓰기');
    expect(writeButton).toBeInTheDocument();
    fireEvent.click(writeButton);
  });

  test('useNavigate should work correctly with accessToken', async () => {
    localStorage.setItem('accessToken', 'mock-token');

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <NavigateBoxUnder {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const writeButton = screen.getByText('글쓰기');
    fireEvent.click(writeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/community/posting');
    mockNavigate.mockReset();

    const replyButton = screen.getByText('목록');
    fireEvent.click(replyButton);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
  });

  test('replyButton should not work', async () => {
    localStorage.setItem('accessToken', 'mock-token');
    const mockAlert = jest.fn();
    global.alert = mockAlert;

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <NavigateBoxUnder {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const writeButton = screen.getByText('답글');
    fireEvent.click(writeButton);
    expect(alert).toHaveBeenCalledWith('서비스 준비중입니다.');
  });
});
