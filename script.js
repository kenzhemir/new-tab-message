function loadMessage(textField) {
    chrome.storage.sync.get(null, function(items) {
        var loadedMessage = items[textField.name] || 'click and edit this message';
        textField.value = loadedMessage;
    });
}

function storeMessage(event) {
    var items = {};
    items[event.target.name] = event.target.value;
    chrome.storage.sync.set(items)
}

document.addEventListener('DOMContentLoaded', function() {
    var textField = document.getElementById('message');
    loadMessage(textField);
    textField.addEventListener('input', storeMessage);
})