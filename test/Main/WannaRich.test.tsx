import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import * as reactRouter from 'react-router';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import WannaRich from '../../src/pages/Main/components/WannaRich';

test('Title Component Render', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={{ style: theme, variables }}>
        <WannaRich />
      </ThemeProvider>
    </MemoryRouter>,
  );
  const titleElement = screen.getByText(/부자가 되고 싶으세요?/);
  expect(titleElement).toBeInTheDocument();
});

test('Login Button Render', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={{ style: theme, variables }}>
        <WannaRich />
      </ThemeProvider>
    </MemoryRouter>,
  );
  const loginButton = screen.getByText(/회원가입/);
  expect(loginButton).toBeInTheDocument();
});

const mockNavigate = jest.fn();
jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

test('Clicking Login Button and Navigating "/login"', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={{ style: theme, variables }}>
        <WannaRich />
      </ThemeProvider>
    </MemoryRouter>,
  );

  const loginButton = screen.getByText(/회원가입/);
  fireEvent.click(loginButton);

  expect(mockNavigate).toHaveBeenCalledWith('/login');
});
