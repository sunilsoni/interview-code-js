const obj = {
    name: "JavaScript",
    greet: function () {
        const inner = () => {
            console.log(this.name);
        };
        inner();
    }
};

obj.greet();