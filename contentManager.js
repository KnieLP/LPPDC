lpTag.agentSDK.init();

var contentManager = {};

contentManager.getAgentNickName = function()
{
	lpTag.agentSDK.get("agentInfo.agentNickname", contentManager.onGetAgentSuccess, contentManager.onGetAgentError);
}

contentManager.onGetAgentSuccess = function(data)
{
	var agentNick = data;
	console.log(data);
	contentManager.createMessages(agentNick);
}

contentManager.onGetAgentError = function(err)
{
	console.log(err);
}

contentManager.createMessages = function(agentId)
{
	var agentData = window.widgetData.agents[agentId];
	for (var j = 0; j < agentData.personalizedContent.length; j++)
	{
		var currentContent = agentData.personalizedContent[j];

		var categoryName = contentManager.findOrAddCategory(currentContent.category);
		contentManager.addMessage(categoryName, currentContent.shortName, currentContent.messageText);
	}
	var acc = document.getElementsByClassName("categories");
	var i;

	for (i = 0; i < acc.length; i++) {
	   acc[i].onclick = function(){
	       this.classList.toggle("active");
	       var textMessage = this.nextElementSibling;
	       if (textMessage.style.display === "block") {
	           textMessage.style.display = "none";
	       } else {
	           textMessage.style.display = "block";
	       }
	   }
}
}

contentManager.findOrAddCategory = function(categoryName)
{
	//Find Category based on some element id Naming convention.
	var idString = "cat_"+categoryName;
	var domObj = document.getElementById(idString);
	if (domObj == null)
	{
		contentManager.addCategory(categoryName);
	}

	return categoryName;
}

contentManager.addCategory = function(categoryName)
{
	//add message to category with the shortname with the message text to send to the text entry box.
	console.log("Adding Category:",categoryName);
	var containerDiv = document.createElement('div');
	containerDiv.id = "cat_" + categoryName;
	var msgUL = document.createElement('ul');
	msgUL.id = "ul_" + categoryName;
	msgUL.style.display = "none";
	var domObj = document.createElement('button');
	domObj.id = "btn_" + categoryName;
	domObj.className = "categories";
	domObj.innerText = categoryName;
	containerDiv.append(domObj);
	containerDiv.append(msgUL);
	document.body.append(containerDiv);
}

contentManager.addMessage = function(categoryName, shortName, messageText)
{
	//add message to category with the shortname with the message text to send to the text entry box.
	console.log("Adding Message:", "In Category: " + categoryName, "Short Text: " + shortName, "Message Text: " + messageText);
	var domObj = document.createElement('li');
	domObj.id = "msg_" + categoryName + "_" + shortName;
	domObj.innerText = shortName;
	domObj.setAttribute("data-text", messageText);
	domObj.className = "textMessage";
	domObj.addEventListener('click',function(){contentManager.writeToChatLine(this.attributes["data-text"].value);},false);
	document.getElementById("ul_"+categoryName).append(domObj);
}

contentManager.writeToChatLine = function(textToSend)
{
        var cmdName = lpTag.agentSDK.cmdNames.write; // = "Write ChatLine" this is referenced like this in case the SDK command string changes with a new version for some reason
        var data = {text: textToSend}; //Specify what chat line is to be written.
        
        //Do the thing. Win the points.
        lpTag.agentSDK.command(cmdName, data, contentManager.notifyWhenDone);
}

contentManager.notifyWhenDone = function()
{
	//Sorry, this function does nothing right now.
}