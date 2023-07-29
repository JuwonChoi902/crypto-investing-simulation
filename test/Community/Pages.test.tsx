import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import Pages from '../../src/pages/Community/components/otherComponents/Pages';

describe('Pages Component', () => {
  const testProps = {
    setPage: jest.fn(),
    page: 1,
    postNumber: 100,
    limit: 10,
  };

  test('should render pageRight component when page index is over 1', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Pages {...testProps} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });
    const pageRightComponent = screen.getByTestId('pageright-component');
    expect(pageRightComponent).toHaveStyle('display:flex');
  });

  test('should not render pageRight component when page index is not over 1', async () => {
    const testProps2 = { ...testProps, postNumber: 30, page: 1 };

    await act(async () => {
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Pages {...testProps2} />
          </ThemeProvider>
        </MemoryRouter>,
      );
    });

    const pageRightComponent = screen.getByTestId('pageright-component');
    expect(pageRightComponent).toHaveStyle('display:none');
  });
});
