import React from 'react';

function WelcomeTitle({ primary, user }) {
    const text = user !== undefined ? `Welcome ${user}!` : 'Welcome!';
    return primary ? <h1>{text}</h1> : <h2>{text}</h2>;
}

export function Preview() {
    return <WelcomeTitle user="Peter" primary />;
}

export default WelcomeTitle;