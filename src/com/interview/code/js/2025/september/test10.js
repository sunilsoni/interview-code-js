window.informer = window.informer || {};

(function () {
    window.informer.user = {
        firstName: 'John',
        lastName: 'Doe'
    };

    window.informer.init = function () {
        document.getElementById('get-full-name-btn').addEventListener('click', function () {
            processObject();
            const fullName = window.informer.user.getFullName;
            document.getElementsByClassName('full-name-value')[0].innerHTML = fullName;
        });
    };

    function processObject() {
        const user = window.informer.user || {};
        if (!Object.prototype.hasOwnProperty.call(user, 'getFullName')) {
            Object.defineProperty(user, 'getFullName', {
                get: function () {
                    const f = this.firstName == null ? '' : String(this.firstName);
                    const l = this.lastName == null ? '' : String(this.lastName);
                    return (f + ' ' + l).trim();
                },
                enumerable: true,
                configurable: false
            });
        }
    }
})();
