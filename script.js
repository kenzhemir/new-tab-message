document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('task');

    input.value = localStorage[input.name];

    input.addEventListener('input', function (e) {
        localStorage[e.target.name] = e.target.value;
    });
})