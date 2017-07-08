chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "source") {
    message.innerText = "Sending to Assemble..."

    var data = {
      "query": "mutation ($data: ArbitraryObject!, $extension_uuid: String!){\n  create_chrome_extension_event(\n    extension_uuid: $extension_uuid,\n    data: $data\n    ) {\n    data\n  }\n}",
      "variables":{
        "data":{
          "html": request.source
        },
        extension_uuid: "aaaa-bbbb-cccc-dddd-eeee",
      }
    }

    $.post("https://assembleapp.co/api", data, function() {
      message.innerText = "Page HTML sent to Assemble"
    })
  }
});

function onWindowLoad() {
  var message = document.querySelector('#message');

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
