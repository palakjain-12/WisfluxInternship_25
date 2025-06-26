import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="app">
      <Header />
      <main className="container">
        {children}
      </main>
    </div>
  );
};

export default Layout;