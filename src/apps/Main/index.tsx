import React from 'react';
import WebsiteBlacklist from './components/WebsiteBlacklist';

const App: React.FC = () => {
  return (
    <section className='section'>
      <div className='container'>
        <div className='columns'>
          <div className='column is-6'>
            <WebsiteBlacklist />
          </div>
          <div className='column is-6'>
            <WebsiteBlacklist />
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
