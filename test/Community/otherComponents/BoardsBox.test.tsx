import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../../src/styles/theme';
import variables from '../../../src/styles/variables';
import BoardsBox from '../../../src/pages/Community/components/otherComponents/BoardsBox';

describe('BoardsBox Component', () => {
  const testProps = {
    setPostNow: jest.fn(),
    setBoardNow: jest.fn(),
    setIsItSearching: jest.fn(),
    boardNow: 0,
  };

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
            <BoardsBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const board1 = screen.getByText('전체글보기');
    const board2 = screen.getByText('질문하기');
    const board3 = screen.getByText('자랑하기');
    const board4 = screen.getByText('공유하기');
    const board5 = screen.getByText('잡담하기');

    expect(board1).toBeInTheDocument();
    expect(board2).toBeInTheDocument();
    expect(board3).toBeInTheDocument();
    expect(board4).toBeInTheDocument();
    expect(board5).toBeInTheDocument();
  });

  test('useNavigate should work correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <BoardsBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const button1 = screen.getByText('전체글보기');
    const button2 = screen.getByText('질문하기');
    const button3 = screen.getByText('자랑하기');
    const button4 = screen.getByText('공유하기');
    const button5 = screen.getByText('잡담하기');

    fireEvent.click(button1);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
    mockNavigate.mockReset();

    fireEvent.click(button2);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
    mockNavigate.mockReset();

    fireEvent.click(button3);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
    mockNavigate.mockReset();

    fireEvent.click(button4);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
    mockNavigate.mockReset();

    fireEvent.click(button5);
    expect(mockNavigate).toHaveBeenCalledWith('/community/list');
    mockNavigate.mockReset();
  });

  test('props functions should work correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <BoardsBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const button2 = screen.getByText('질문하기');
    fireEvent.click(button2);

    expect(testProps.setBoardNow).toHaveBeenCalledWith(1);
    expect(testProps.setPostNow).toHaveBeenCalledWith(null);
    expect(testProps.setIsItSearching).toHaveBeenCalledWith(false);
  });

  test('boards styles should change correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <BoardsBox {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const button = screen.getByText('전체글보기');
    expect(button).toHaveStyle('font-weight:bold');
  });

  test('boards styles should change correctly', async () => {
    const testProps2 = { ...testProps, boardNow: 1 };
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <BoardsBox {...testProps2} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const button = screen.getByText('전체글보기');
    expect(button).toHaveStyle('font-weight:normal');
  });
});
