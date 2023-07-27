import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import Main from '../../src/pages/Main/Main';

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
  test('should render BillBoard, Popular, NeedHelp, and WannaRich components', () => {
    // Render the Main component
    const { getByTestId } = render(
      <MemoryRouter>
        <ThemeProvider theme={{ style: theme, variables }}>
          <Main />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // Check if the BillBoard component is rendered
    const billBoardComponent = getByTestId('billboard-component');
    expect(billBoardComponent).toBeInTheDocument();

    // Check if the Popular component is rendered
    const popularComponent = getByTestId('popular-component');
    expect(popularComponent).toBeInTheDocument();

    // Check if the NeedHelp component is rendered
    const needHelpComponent = getByTestId('needhelp-component');
    expect(needHelpComponent).toBeInTheDocument();

    // Check if the WannaRich component is rendered when the user is not logged in
    const wannaRichComponent = getByTestId('wannarich-component');
    expect(wannaRichComponent).toBeInTheDocument();
  });
});
