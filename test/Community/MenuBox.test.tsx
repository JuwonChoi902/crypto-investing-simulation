import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import MenuBox from '../../src/pages/Community/components/otherComponents/MenuBox';

describe('MenuBox Component', () => {
  const testProps = {
    setMenuNow: jest.fn(),
    setBoardNow: jest.fn(),
    setIsItSearching: jest.fn(),
    setProfileId: jest.fn(),
    menuNow: 1,
  };

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

  beforeEach(() => {
    mockNavigate.mockReset();
  });

  test('should render components correcty when all states are default', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <MenuBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const component1 = screen.getByAltText('star');
    const component2 = screen.getByText('게시글 보기');
    const component3 = screen.getByText('유저페이지');

    expect(component1).toBeInTheDocument();
    expect(component2).toBeInTheDocument();
    expect(component3).toBeInTheDocument();
  });

  test('props functions should work correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <MenuBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const component1 = screen.getByAltText('star');
    const component2 = screen.getByText('게시글 보기');

    fireEvent.click(component1);
    expect(testProps.setBoardNow).toHaveBeenCalledWith(null);
    expect(testProps.setIsItSearching).toHaveBeenCalledWith(false);
    expect(testProps.setMenuNow).toHaveBeenCalledWith(0);
    expect(mockNavigate).toHaveBeenCalledWith('/community/favorite');
    mockNavigate.mockReset();

    fireEvent.click(component2);
    expect(testProps.setBoardNow).toHaveBeenCalledWith(0);
    expect(testProps.setIsItSearching).toHaveBeenCalledWith(false);
    expect(testProps.setMenuNow).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
    mockNavigate.mockReset();
  });

  test('UserProfile should not work when the accessToken is not found', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <MenuBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const component3 = screen.getByText('유저페이지');
    fireEvent.click(component3);
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });

  test('UserProfile should work when the accessToken is found', async () => {
    localStorage.setItem('accessToken', 'mock-token');

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <MenuBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const component3 = screen.getByText('유저페이지');
    fireEvent.click(component3);
    expect(mockNavigate).toHaveBeenCalledWith('/community/profile');
  });
});
