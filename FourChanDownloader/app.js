var getDownloadLink = function(t, u, b) {
	var downloadA = document.createElement("a");
	downloadA.classList.add("replylink");
	downloadA.innerText = "Download";
	downloadA.href = "#";

	downloadA.setAttribute('data-thread', t);
	downloadA.setAttribute('data-board', b);
	downloadA.setAttribute('data-url', u);

	// Happen when the user click on the button
	downloadA.addEventListener("click", function(e){
		e.preventDefault(); // Block the clicking effect
		var downloadData = {
			thread: this.getAttribute("data-thread"),
			url: this.getAttribute("data-url"),
			board: this.getAttribute("data-board")
		};
		chrome.runtime.sendMessage(downloadData); // Send a message on the background which make it possible to connect the socket.io server.
	});

	return downloadA;
}

function addDownloadButton(){
	var isThread = location.pathname.includes("thread");

	var boardTitle = document.getElementsByClassName("boardTitle")[0].innerText;
	boardTitle = boardTitle.replace(boardTitle.split(" ")[0], "").replace(boardTitle.split(" ")[1], "").replace("  ", "");

	if(isThread) {
		var navLinks = document.getElementsByClassName("navLinks")[1];
		var postInfo = document.getElementsByClassName("thread")[0].getElementsByClassName("postContainer")[0].getElementsByClassName("post")[0].getElementsByClassName("postInfo")[0];
		
		var threadName = postInfo.getElementsByClassName("subject")[0].innerText;

		if(threadName.length == 0)
			threadName = document.getElementsByClassName("thread")[0].id.replace("t", "");

		navLinks.insertBefore(getDownloadLink(threadName, location.href, boardTitle), navLinks.getElementsByTagName("A")[3]);
		navLinks.insertBefore(document.createTextNode("] ["), navLinks.getElementsByTagName("A")[4]);
		
	} else {
		var threads = document.getElementsByClassName("thread");	
		
		for(t in threads) {
			if(threads[t].tagName == "DIV") {
				var postinfo = threads[t].getElementsByClassName("postContainer")[0].getElementsByClassName("post")[0].getElementsByClassName("postInfo")[0];
				var threadName = postinfo.getElementsByClassName("subject")[0].innerText;
				var threadBar = postinfo.getElementsByClassName("postNum")[0];

				if(threadName.length == 0)
					threadName = threads[t].id.replace("t", "");

				var threadUrl = threadBar.getElementsByTagName("SPAN")[0].getElementsByTagName("A")[0].href;
				
				var downloadSpan = document.createElement("span");
				downloadSpan.appendChild(document.createTextNode("["));

				var downloadA = getDownloadLink(threadName, threadUrl, boardTitle);

				downloadSpan.appendChild(downloadA);
				downloadSpan.appendChild(document.createTextNode("] "));

				threadBar.insertBefore(downloadSpan, threadBar.getElementsByTagName("SPAN")[0]);
			}

			if(t == threads.length - 1) 
				break;
		}
	}
}

addDownloadButton();