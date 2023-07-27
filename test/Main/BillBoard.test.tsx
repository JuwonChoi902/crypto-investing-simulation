import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { act } from 'react-dom/test-utils';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import BillBoard from '../../src/pages/Main/components/BillBoard';

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({ isSuccess: true, data: { count: 10 } }),
  }),
);

describe('BillBoard Component', () => {
  test('should render the spinner when volume prop is not provided', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <BillBoard volume={undefined} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });
    const spinnerElements = screen.queryAllByTestId('custom-spinner');
    expect(spinnerElements).toHaveLength(2);
  });

  test('should not render the spinner when volume prop is not provided', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <BillBoard volume={1000000} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });
    const spinnerElements = screen.queryAllByTestId('custom-spinner');
    expect(spinnerElements).toHaveLength(1);
  });

  test('should render fetch data correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <BillBoard volume={1000000} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const userCountElement = screen.getByText('10 명');
    expect(userCountElement).toBeInTheDocument();
  });
});
