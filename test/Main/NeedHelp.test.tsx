import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import NeedHelp from '../../src/pages/Main/components/NeedHelp';

test('Renders NeedHelp element', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={{ style: theme, variables }}>
        <NeedHelp />
      </ThemeProvider>
    </MemoryRouter>,
  );
  const mainElement = screen.getByText(/도움이 필요하세요?/);
  expect(mainElement).toBeInTheDocument();
});

test('Renders 24hours element', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={{ style: theme, variables }}>
        <NeedHelp />
      </ThemeProvider>
    </MemoryRouter>,
  );
  const mainElement = screen.getByText(/24시간 상담 가능/);
  expect(mainElement).toBeInTheDocument();
});

test('Renders Ask element', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={{ style: theme, variables }}>
        <NeedHelp />
      </ThemeProvider>
    </MemoryRouter>,
  );
  const mainElement = screen.getByText('자주 묻는 질문');
  expect(mainElement).toBeInTheDocument();
});

test('Renders 커뮤니티 element', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={{ style: theme, variables }}>
        <NeedHelp />
      </ThemeProvider>
    </MemoryRouter>,
  );
  const mainElement = screen.getByText(/커뮤니티/);
  expect(mainElement).toBeInTheDocument();
});
