import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import SearchBarTop from '../../../src/pages/Community/components/postComponents/SearchBarTop';
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
  setBoardNow: jest.fn(),
  setPosts: jest.fn(),
  setPostNumber: jest.fn(),
  searchRes: { filterRes: 'nickname', stringRes: '주원', boardRes: 0 },
  setSearchRes: jest.fn(),
};

describe('SearchBarTop Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should render components when all states are default', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <SearchBarTop {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const boardSelectBox = screen.getByTestId('topBoardSelectBox');
    const filterSelectBox = screen.getByTestId('topFilterSelectBox');
    const searchButton = screen.getByText('검색');

    expect(boardSelectBox).toBeInTheDocument();
    expect(filterSelectBox).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('dropbox should open when it has been clicked ', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <SearchBarTop {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const boardSelectBox = screen.getByTestId('topBoardSelectBox');
    fireEvent.click(boardSelectBox);
    const dropbox = screen.getByTestId('topBoardDropBox');
    expect(dropbox).toHaveStyle('display:block');
    const filterSelectBox = screen.getByTestId('topFilterSelectBox');
    fireEvent.click(filterSelectBox);
    const filterDropBox = screen.getByTestId('topFilterDropBox');
    expect(filterDropBox).toHaveStyle('display:block');
  });

  test('search result should mound correctly when the component is rendered', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <SearchBarTop {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const boardSelectBox = screen.getByTestId('topBoardSelectBox');
    const filterSelectBox = screen.getByTestId('topFilterSelectBox');
    const inputBox = screen.getByTestId('topInputBox');

    expect(boardSelectBox).toHaveTextContent('전체글');
    expect(filterSelectBox).toHaveTextContent('작성자');
    expect(inputBox).toHaveValue('주원');
  });

  test('searchProcess works correctly', async () => {
    const mockGetList = getPostListData as jest.Mock;
    mockGetList.mockResolvedValue([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <SearchBarTop {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const boardSelectBox = screen.getByTestId('topBoardSelectBox');
    fireEvent.click(boardSelectBox);
    const boardLiElement = screen.queryAllByRole('presentation');
    fireEvent.click(boardLiElement[1]);
    expect(boardSelectBox).toHaveTextContent('질문하기');

    const filterSelectBox = screen.getByTestId('topFilterSelectBox');
    fireEvent.click(filterSelectBox);
    const filterLiElement = screen.queryAllByRole('presentation');
    fireEvent.click(filterLiElement[2]);
    expect(filterSelectBox).toHaveTextContent('댓글내용');

    const inputBox = screen.getByTestId('topInputBox') as HTMLInputElement;
    fireEvent.change(inputBox, { target: { value: 'test' } });
    expect(inputBox.value).toBe('test');
    const searchButton = screen.getByText('검색');
    fireEvent.click(searchButton);
    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith(
      true,
      1,
      1,
      1,
      'reply',
      'test',
      undefined,
      expect.any(Function),
      expect.any(Function),
    );
  });
});
