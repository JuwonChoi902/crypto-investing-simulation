import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import NavigateBoxUnder from '../../../src/pages/Community/components/postComponents/NavigateBoxUnder';
import exp from 'constants';

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
  });
});
