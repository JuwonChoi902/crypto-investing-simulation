import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import Nav from '../../src/components/Nav/Nav';

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

describe('Nav component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
  });

  test('should render Title, Button components', async () => {
    await act(async () =>
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Nav />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );
    const titleElement = screen.getByText('CryptoBy');
    const goMarketButton = screen.getByText('구매하기');
    const goCommunityButton = screen.getByText('커뮤니티');

    expect(titleElement).toBeInTheDocument();
    expect(goMarketButton).toBeInTheDocument();
    expect(goCommunityButton).toBeInTheDocument();
  });

  test('left side button changes color correctly', async () => {
    await act(async () =>
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Nav />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );

    const yellowButtonComponent = screen.getByTestId('yellowbutton-component');
    fireEvent.mouseOver(yellowButtonComponent);
    const menuYellowElement = screen.getByAltText('menuYellow');
    expect(menuYellowElement).toBeInTheDocument();

    fireEvent.mouseOut(yellowButtonComponent);
    const menuLeftElement = screen.getByAltText('menuLeft');
    expect(menuLeftElement).toBeInTheDocument();
  });

  test('should render loginButton and registerButton when accessToken is not found', async () => {
    await act(async () =>
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Nav />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );

    const loginButton = screen.getByText('로그인');
    const registerButton = screen.getByText('회원가입');

    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  test('should render logoutButton and userImg when accessToken is found', async () => {
    localStorage.setItem('accessToken', 'mock-token');

    await act(async () =>
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Nav />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );

    const loginButton = screen.queryByText('로그인');
    const registerButton = screen.queryByText('회원가입');
    const logoutButton = screen.getByText('로그아웃');
    const userImgComponent = screen.getByAltText('user');

    expect(loginButton).not.toBeInTheDocument();
    expect(registerButton).not.toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
    expect(userImgComponent).toBeInTheDocument();
  });

  test('logoutButton works correctly', async () => {
    localStorage.setItem('accessToken', 'mock-token');

    await act(async () =>
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Nav />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );

    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);
    const accessToken = localStorage.getItem('accessToken');
    expect(accessToken).toBe(undefined);
  });

  test('loginButton works correctly', async () => {
    await act(async () =>
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Nav />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );

    const loginButton = screen.getByText('로그인');
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('goMarketButton works correctly', async () => {
    await act(async () =>
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Nav />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );

    const goMarketButton = screen.getByText('구매하기');
    fireEvent.click(goMarketButton);
    expect(mockNavigate).toHaveBeenCalledWith('/market');
  });

  test('goCommunityButton work correctly', async () => {
    await act(async () =>
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Nav />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );

    const goCommunityButton = screen.getByText('커뮤니티');
    fireEvent.click(goCommunityButton);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
  });
});
