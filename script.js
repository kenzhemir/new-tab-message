document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('message');

    input.value = localStorage[input.name] || 'type message here';

    input.addEventListener('input', function (e) {
        localStorage[e.target.name] = e.target.value;
    });
})