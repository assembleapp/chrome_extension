chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "source") {
    message.innerText = "Sending to Assemble..."

    chrome.storage.local.get("key", function(storage) {
      var data = {
        "query": "mutation ($data: ArbitraryObject!, $extension_uuid: String!){\n  create_chrome_extension_event(\n    extension_uuid: $extension_uuid,\n    data: $data\n    ) {\n    data\n  }\n}",
        "variables":{
          "data":{
            "html": request.source
          },
          extension_uuid: storage.key,
        }
      }

      console.log("Sending HTML to Assemble")
      console.log(data)

      $.post("https://assembleapp.co/api", data, function() {
        message.innerText = "Page HTML sent to Assemble"
      })
    })
  }
});

function onWindowLoad() {
  var message = document.querySelector('#message');
  var uuid = document.querySelector("#uuid");

  chrome.storage.local.get("key", function(data) {
    var key = data.key

    if(key == null) {
      key = uuidv4()
      chrome.storage.local.set({key: key});
    }

    uuid.innerText = key
  });

  chrome.tabs.executeScript(null, {
    file: "getPageSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
