// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import { ThemeProvider } from 'styled-components';
// import * as reactRouter from 'react-router';
// import { act } from 'react-dom/test-utils';
// import theme from '../../src/styles/theme';
// import variables from '../../src/styles/variables';
// import Popular from '../../src/pages/Main/components/Popular';

// class WebSocketHandler {
//   private webSocket: WebSocket | null = null;

//   constructor(url: string) {
//     this.webSocket = new WebSocket(url);
//     this.webSocket.onmessage = this.onMessage;
//   }

//   private onMessage = (event: MessageEvent) => {
//     // Use optional chaining to access properties
//     const data = JSON.parse(event?.data ?? '');
//     if (data) {
//       // Process the data here
//     }
//   };
// }

// jest.mock('react', () => {
//   const ActualReact = jest.requireActual('react');
//   return {
//     ...ActualReact,
//     useEffect: jest.fn((callback) => callback()),
//   };
// });

// describe('Popular Component', () => {
//   test('Websocket should be connected', () => {
//     const mockWebSockets = (WebSocket) => [
//       new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker'),
//       new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@ticker'),
//       new WebSocket('wss://stream.binance.com:9443/ws/busdusdt@ticker'),
//       new WebSocket('wss://stream.binance.com:9443/ws/bnbusdt@ticker'),
//       new WebSocket('wss://stream.binance.com:9443/ws/usdcusdt@ticker'),
//     ];

//     const mockWebSocket = jest.fn(() => ({
//       addEventListener: jest.fn(),
//       close: jest.fn(),
//     }));
//     global.WebSocket = mockWebSocket;

//     render(
//       <MemoryRouter>
//         <ThemeProvider theme={{ style: theme, variables }}>
//           <Popular />
//         </ThemeProvider>
//       </MemoryRouter>,
//     );
//   });
// });
