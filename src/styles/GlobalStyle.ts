import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    box-sizing: border-box;
    font-family: Nanum Gothic Coding
  }
`;

export default GlobalStyle;
