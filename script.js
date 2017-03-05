function loadMessage(textField) {
    chrome.storage.sync.get(null, function(items) {
        var msg = items[textField.name];
        var loadedMessage = (msg === undefined)
                            ? 'click and edit this message'
                            : msg;
        textField.value = loadedMessage;
    });
}

function storeMessage(event) {
    var items = {};
    items[event.target.name] = event.target.value;
    chrome.storage.sync.set(items)
}

function debounce(callback, ms) {
    var id = null;
    return function(e) {
        clearTimeout(id);
        id = setTimeout(callback.bind(window, e), ms);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var textField = document.getElementById('message');
    loadMessage(textField);
    textField.addEventListener('input', debounce(storeMessage, 100));

    chrome.storage.onChanged.addListener(function() {
        // If you load while the user is typing – it can potentially erase recent input,
        // since input listener is debounced.
        // If the textField is not active, then there is no input there.
        // Like in another window / tab.
        if (textField === document.activeElement) return;
        loadMessage(textField);
    });
})