import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function CustomSpinner() {
  return (
    <ClipLoader
      data-testid='custom-spinner'
      color='#707A8A'
      size={18}
      speedMultiplier={0.8}
      cssOverride={{
        opacity: 0.35,
        margin: '7px 0px',
      }}
    />
  );
}
