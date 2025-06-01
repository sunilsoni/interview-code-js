console.log('start');

const promise1 = Promise.resolve().then(() => {
    console.log("promise1");
    const timer1 = setTimeout(() => {
        console.log("timer1");
    }, 0);
});

const timer2 = setTimeout(() => {
    console.log("timer2");
    const promise2 = Promise.resolve().then(() => {
        console.log("promise2");
    });
}, 0);

console.log("end");
