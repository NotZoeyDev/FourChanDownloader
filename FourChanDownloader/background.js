chrome.runtime.onMessage.addListener(
	function(request,sender,senderResponse) {
		var fullpath = request.board + "/" + request.thread;
		var XMLrq = new XMLHttpRequest();
		XMLrq.open("get", request.url, true);
		XMLrq.send(null);

		XMLrq.onreadystatechange = function() {
			if(XMLrq.readyState == 4) {
				var threadHTML = document.createElement("html");
				threadHTML.innerHTML = XMLrq.responseText;

				var filesDiv = threadHTML.getElementsByClassName("fileText");
				for(fls in filesDiv) {

					if(filesDiv[fls].childNodes.length > 1) {
						var fileA = filesDiv[fls].getElementsByTagName("A")[0];
						var finalName = fullpath + "/" + fileA.textContent;

						chrome.downloads.download({url: fileA.href.replace("chrome-extension:", "https:"), filename: finalName});
					}

					if(fls == filesDiv.length - 1) {
						break; // how to fix a bug like a pro
					}
				}
			}
		}
	}
);