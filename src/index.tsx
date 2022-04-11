import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ReactSampleApp } from './ReactSampleApp';

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <ReactSampleApp />
    </RecoilRoot>
  );
};

const container = document.getElementById('react-sample');
const root = createRoot(container);
root.render(<App />);
