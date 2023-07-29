import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../src/styles/theme';
import variables from '../../src/styles/variables';
import Footer from '../../src/components/Footer/Footer';

describe('Footer Component', () => {
  test('should render components', async () => {
    await act(async () =>
      render(
        <MemoryRouter>
          <ThemeProvider theme={{ style: theme, variables }}>
            <Footer />
          </ThemeProvider>
        </MemoryRouter>,
      ),
    );
    const aboutUs = screen.getByText('About Us');
    const service = screen.getByText('Service');
    const learn = screen.getByText('Learn');
    const market = screen.getByText('구매하기');
    const myWallet = screen.getByText('내지갑');
    const community = screen.getByText('커뮤니티');

    expect(aboutUs).toBeInTheDocument();
    expect(service).toBeInTheDocument();
    expect(learn).toBeInTheDocument();
    expect(market).toBeInTheDocument();
    expect(myWallet).toBeInTheDocument();
    expect(community).toBeInTheDocument();
  });
});
