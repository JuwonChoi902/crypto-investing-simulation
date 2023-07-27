import React from 'react';

export const css = (strings, ...values) => {
  const str = strings.reduce((acc, string, i) => acc + string + (values[i] || ''), '');
  return str;
};

const styled = {
  css,
  div: ({ children }) => <div>{children}</div>,
};

export default styled;
