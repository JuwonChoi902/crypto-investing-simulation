import { Component } from 'react';

const popularDummyCoins = [
  { id: 1, name: 'Bitcoin', nick: 'BTC', symbol: 'btcusdt', imgURL: '', quantity: 19365700 },
  { id: 2, name: 'Ethereum', nick: 'ETH', symbol: 'ethusdt', imgURL: '', quantity: 120350515 },
  { id: 3, name: 'TetherUS', nick: 'USDT', symbol: 'busdusdt', imgURL: '', quantity: 82160000000 },
  { id: 4, name: 'BNB', nick: 'BNB', symbol: 'bnbusdt', imgURL: '', quantity: 155900000 },
  { id: 5, name: 'USD coin', nick: 'USDC', symbol: 'usdcusdt', imgURL: '', quantity: 30390000000 },
];

const tenDummyCoins = [
  { id: 1, name: 'Bitcoin', nick: 'BTC', symbol: 'btcusdt', imgURL: '', quantity: 19365700 },
  { id: 2, name: 'Ethereum', nick: 'ETH', symbol: 'ethusdt', imgURL: '', quantity: 120350515 },
  { id: 3, name: 'TetherUS', nick: 'USDT', symbol: 'busdusdt', imgURL: '', quantity: 82160000000 },
  { id: 4, name: 'BNB', nick: 'BNB', symbol: 'bnbusdt', imgURL: '', quantity: 155900000 },
  { id: 5, name: 'USD coin', nick: 'USDC', symbol: 'usdcusdt', imgURL: '', quantity: 30390000000 },
  { id: 6, name: 'Ripple', nick: 'XRP', symbol: 'xrpusdt', imgURL: '', quantity: 100000000000 },
  { id: 7, name: 'Cardano', nick: 'ADA', symbol: 'adausdt', imgURL: '', quantity: 63000000000 },
  { id: 8, name: 'Dogecoin', nick: 'DOGE', symbol: 'dogeusdt', imgURL: '', quantity: 132670764300 },
  { id: 9, name: 'Polygon', nick: 'MATIC', symbol: 'maticusdt', imgURL: '', quantity: 9249469069 },
  { id: 10, name: 'Solana', nick: 'SOL', symbol: 'solusdt', imgURL: '', quantity: 260000000 },
];

const userData = {
  id: '15',
  nickname: '주원쓰',
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoicnlvbzYwNTNAZ21haWwuY29tIiwiaWF0IjoxNjkxMTU1NTcwLCJleHAiOjE2OTExNTczNzB9.e9pRG1YFJfr9yLrRYxOTvHGPy0F29K4kdVWS5aVtHJ0',
};

const defaultComponentsForMain = [
  '인기 가상화폐',
  '로그인',
  '회원가입',
  '구매하기',
  '커뮤니티',
  '도움이 필요하세요?',
  '부자가 되고 싶으세요?',
];

const defaultComponentsForCommunity = [
  '게시글 보기',
  '유저페이지',
  '전체글보기',
  '질문하기',
  '자랑하기',
  '공유하기',
  '잡담하기',
  '글 작성하기',
];

describe('E2E test for CryptoBy', () => {
  // it('connect to main page and explore before community page', () => {
  //   cy.visit('https://d338zyj32yduia.cloudfront.net/');
  //   //should render nav components,

  //   defaultComponentsForMain.forEach((component) => {
  //     cy.contains(component).should('exist');
  //   });

  //   //websocokets should connect and all the coin websocket data should mount within 2 seconds.
  //   // cy.wait(2000);

  //   // const webScoketUrl = popularDummyCoins.map(
  //   //   (coin) => `wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`,
  //   // );

  //   // webScoketUrl.forEach((url) => {
  //   //   cy.intercept('GET', url).as(`${url}-request`);
  //   // });

  //   // webScoketUrl.forEach((url) => {
  //   //   cy.wait(`@${url}-request`).then((interception) => {
  //   //     if (interception.response) expect(interception.response.statusCode).to.equal(101);
  //   //   });
  //   // });

  //   popularDummyCoins.forEach((coin) => {
  //     cy.contains(coin.name).should('exist');
  //   });

  //   //register and login process should work correctly.
  //   cy.contains('회원가입').click();

  //   cy.window().then((win) => {
  //     win.localStorage.setItem('accessToken', userData.accessToken);
  //     win.localStorage.setItem('id', userData.id);
  //     win.localStorage.setItem('nickname', userData.nickname);
  //   });

  //   cy.window()
  //     .its('localStorage')
  //     .should(
  //       'have.property',
  //       'accessToken',
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoicnlvbzYwNTNAZ21haWwuY29tIiwiaWF0IjoxNjkxMTU1NTcwLCJleHAiOjE2OTExNTczNzB9.e9pRG1YFJfr9yLrRYxOTvHGPy0F29K4kdVWS5aVtHJ0',
  //     );
  //   cy.contains('CryptoBy').click();

  //   //Market page coins websocket should connect correctly
  //   cy.contains('로그아웃').should('exist');
  //   cy.contains('구매하기').click();
  //   // cy.wait(3500);
  //   tenDummyCoins.forEach((coin) => {
  //     cy.contains(coin.name).should('exist');
  //   });
  //   cy.contains('Bitcoin').click();
  //   cy.contains('구매하기').should('exist');
  //   cy.contains('매도하기').should('exist');

  //   cy.contains('확인').click();
  //   cy.contains('전체글보기').should('exist');
  // });

  it('exploring community page should work correctly', () => {
    cy.visit('https://d338zyj32yduia.cloudfront.net/');
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', userData.accessToken);
      win.localStorage.setItem('id', userData.id);
      win.localStorage.setItem('nickname', userData.nickname);
    });

    cy.contains('커뮤니티').click();

    defaultComponentsForCommunity.forEach((component) => {
      cy.contains(component).should('exist');
    });
    cy.wait(2000);
    cy.get('button[data-test-id="page-component-2"]').should('exist');
  });
});
