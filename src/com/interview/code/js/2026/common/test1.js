function Counter() {
    let count = 0;
    const handleClick = () => {
        count++;
        console.log(count);
    };
    return <button onClick={handleClick}>Click</button>;
}