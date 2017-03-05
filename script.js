document.addEventListener('DOMContentLoaded', function () {
    var textField = document.getElementById('message');

    textField.value = localStorage[textField.name] || 'click and edit this message';

    textField.addEventListener('input', function (e) {
        localStorage[e.target.name] = e.target.value;
    });
})