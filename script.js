function loadMessage(textField) {
    chrome.storage.sync.get(null, function(items) {
        var msg = items[textField.name];
        var font = items['font'];
        var size = items['size'];
        var loadedMessage = (msg === undefined)
                            ? 'click and edit this message'
                            : msg;
        var loadedFont = (font === undefined)
                            ? 'Helvetica'
                            : font;
        var loadedSize = (size === undefined)
                            ? '5em'
                            : size;
        textField.value = loadedMessage;
        textField.style.fontFamily = loadedFont;
        textField.style.fontSize = loadedSize;
        document.getElementById('fontSelect').value=loadedFont.replace(/\"/gim, '');
        document.getElementById('sizeInput').value=loadedSize.replace(/\D/gim, '');
    });
}

function storeMessage(event) {
    var items = {};
    items[event.target.name] = event.target.value;
    items['font'] = event.target.style.fontFamily;
    items['size'] = event.target.style.fontSize;
    chrome.storage.sync.set(items)
}

function debounce(callback, ms) {
    var id = null;
    return function(e) {
        clearTimeout(id);
        id = setTimeout(callback.bind(window, e), ms);
    }
}

function settingsPanel(){
  var textField = document.getElementById('message');
  var panel = document.getElementById('settingsPanel');
  var settingsBtn = document.getElementById('settingsBtn');
  if (panel.style.height != '0px'){
    panel.style.height = '0px';
    settingsBtn.style.transform = 'rotate(0deg)';
    textField.removeEventListener('focus', settingsPanel );
  } else {
    panel.style.height = '';
    settingsBtn.style.transform = 'rotate(90deg)';
    textField.addEventListener('focus', settingsPanel );
  }

}

function changeFont(){
    var font = document.getElementById('fontSelect').value;
    var size = document.getElementById('sizeInput').value;
    var textField = document.getElementById('message');
    textField.style.fontFamily = font;
    textField.style.fontSize = size+"em";
    textField.dispatchEvent(new Event('input'));
}

document.addEventListener('DOMContentLoaded', function() {
    var textField = document.getElementById('message');
    var settingsBtn = document.getElementById('settingsBtn');
    var fontSelect = document.getElementById('fontSelect');
    var sizeInput = document.getElementById('sizeInput');
    loadMessage(textField);

    // Debounce listener to prevent exceeding chrome MAX_WRITE_OPERATIONS_PER_MINUTE for storage.sync
    // 500ms is the min delay to prevent exceeding on any possible input
    // but closing the tab within the window of 500ms after typing will result in data loss
    // 200ms is a compromise
    textField.addEventListener('input', debounce(storeMessage, 200));

    settingsBtn.addEventListener('click', settingsPanel );

    fontSelect.addEventListener('change', changeFont );

    sizeInput.addEventListener('change', changeFont );

    chrome.storage.onChanged.addListener(function() {
        // If you load while the user is typing – it can potentially erase recent input,
        // since input listener is debounced.
        // If the textField is not active, then there is no input there.
        // Like in another window / tab.
        if (textField === document.activeElement) return;
        loadMessage(textField);
    });

})
