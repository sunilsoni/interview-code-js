import React, {useState} from 'react';

function Counter() {
    const [value, setValue] = useState(0);
    return (
        <div>
            <p id="value">{value}</p>
            <button id="increment" onClick={() => setValue(v => v + 1)}>+</button>
            <button id="decrement" onClick={() => setValue(v => v - 1)}>-</button>
        </div>
    );
}

export function Preview() {
    return <Counter/>;
}

export default Counter;