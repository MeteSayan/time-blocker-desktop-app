import React, { FC } from 'react';

const WebsiteBlacklist: FC = () => {
    const websites = [
        'facebok.cssdkgjdfkghsfdkjhjsdjfksdfhjksdfa', 'google.dsfdskfjsad'
    ]

    return (
        <nav className='panel'>
            <p className='panel-heading'>Website Blacklist</p>
            <div className='columns is-vcentered is-gapless is-mobile'>
                <div className='column is-8'>
                    <div className='panel-block'>
                        <p className='control has-icons-left'>
                            <input className='input' type='text' placeholder='Search' />
                            <span className='icon is-left'>
                                <i className='fas fa-search' aria-hidden="true"></i>
                            </span>
                        </p>
                    </div>
                </div>
                <div className='column is-4'>
                    <div className='panel-block'>
                        <button className='button is-primary is-light is-outline'>Add Website</button>
                    </div>
                </div>
            </div>

            {websites.map(website => (
                <div key={website} className='panel-block pointer' title={website}>
                    <button className='button is-text is-small panel-icon'>
                        <span className='icon is-small'>
                            <i className='fas fa-trash' aria-hidden="true"></i>
                        </span>
                    </button>
                    <span className='text-overflow'>{website}</span>
                </div>
            ))}

            <div className='panel-block'>
                <button className='button is-outlined is-fullwidth'>
                    Clear Blacklist
                </button>
            </div>
        </nav>
    );
};

export default WebsiteBlacklist;