import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import SearchBarUnder from '../../../src/pages/Community/components/postComponents/SearchBarUnder';
import { getPostListData } from '../../../src/utils/functions';

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

const testProps = {
  setPosts: jest.fn(),
  setPostNumber: jest.fn(),
  setSearchRes: jest.fn(),
  setIsItSearching: jest.fn(),
  boardNow: 0,
  isItSearching: false,
};

describe('SearchBarUnder Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should render components when all states are default', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <SearchBarUnder {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const selectBox = screen.getByTestId('selectBox');
    const inputBox = screen.getByTestId('inputBox');
    const searchButton = screen.getByText('검색');

    expect(selectBox).toBeInTheDocument();
    expect(inputBox).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('dropbox should open when it has been clicked ', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <SearchBarUnder {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const selectBox = screen.getByTestId('selectBox');
    fireEvent.click(selectBox);
    const dropbox = screen.getByTestId('dropbox');
    expect(dropbox).toHaveStyle('display:block');
  });

  test('searchProcess works correctly', async () => {
    const mockGetList = getPostListData as jest.Mock;
    mockGetList.mockResolvedValue([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <SearchBarUnder {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const selectBox = screen.getByTestId('selectBox');
    fireEvent.click(selectBox);
    const liElements = screen.queryAllByRole('presentation');
    fireEvent.click(liElements[1]);
    expect(selectBox).toHaveTextContent('작성자');
    const inputBox = screen.getByTestId('inputBox') as HTMLInputElement;
    fireEvent.change(inputBox, { target: { value: 'testing' } });
    expect(inputBox.value).toBe('testing');
    const searchButton = screen.getByText('검색');
    fireEvent.click(searchButton);
    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith(
      false,
      1,
      0,
      0,
      'nickname',
      'testing',
      undefined,
      expect.any(Function),
      expect.any(Function),
    );
  });
});
