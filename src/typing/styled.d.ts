import { CSSProp } from 'styled-components';
import theme from '../styles/theme';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends theme {}
}

declare module 'react' {
  interface Attributes {
    css?: CSSProp | CSSObject;
  }
}
