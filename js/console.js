function jumpToLine(i) {

    var code = parent.form1.code;

    var editor = code.editorreference;

    // editor.getLineHandle does not help as it does not return the reference of line.
    var ll = editor.doc.lastLine();
    var low=i-1-10;    
    var high=i-1+10;    
    var mid=i-1;
    if (low<0){
    	low=0;
    }
    if (high>ll){
    	high=ll;
    }
    if (mid>ll){
    	mid=ll;
    }

    editor.scrollIntoView(low);
    editor.scrollIntoView(high);
    editor.scrollIntoView(mid);
    editor.setCursor(mid, 0);
}

var consolecache = [];


function consolePrintFromRule(text,rule,urgent) {

	if (urgent===undefined) {
		urgent=false;
	}


	var ruleDirection = dirMaskName[rule.direction];

	var logString = '<font color="green">Rule <a onclick="jumpToLine(' + rule.lineNumber + ');"  href="javascript:void(0);">' + 
			rule.lineNumber + '</a> ' + ruleDirection + " : "  + text + '</font>';

	if (cache_console_messages&&urgent==false) {		
		consolecache.push(logString);
	} else {
		addToConsole(logString);
	}
}

function consolePrint(text,urgent) {

	if (urgent===undefined) {
		urgent=false;
	}
	if (cache_console_messages&&urgent==false) {		
		consolecache.push(text);
	} else {
		consoleCacheDump();
		addToConsole(text);
	}
}


var cache_n = 0;

function addToConsole(text) {
	// console.log(text); // Edit this line to write to specific file
	cache = document.createElement("div");
	cache.id = "cache" + cache_n;
	var time = new Date();
	var timeString = "<br><font color=\"yellow\">" + time + "</font><br>";
	cache.innerHTML = text + timeString;
	cache_n++;
	
	var code = document.getElementById('consoletextarea');
	code.appendChild(cache);
	consolecache=[];
	var objDiv = document.getElementById('lowerarea');
	objDiv.scrollTop = objDiv.scrollHeight;
}

function consoleCacheDump() {
	if (cache_console_messages===false) {
		return;
	}
	
	var lastline = "";
	var times_repeated = 0;
	var summarised_message = "<br>";
	for (var i = 0; i < consolecache.length; i++) {
		if (consolecache[i] == lastline) {
			times_repeated++;
		} else {
			lastline = consolecache[i];
			if (times_repeated > 0) {
				summarised_message = summarised_message + " (x" + (times_repeated + 1) + ")";
			}
			summarised_message += "<br>"
			summarised_message += lastline;
			times_repeated = 0;
		}
	}

	if (times_repeated > 0) {
		summarised_message = summarised_message + " (x" + (times_repeated + 1) + ")";
	}

	if (summarised_message !== "<br>")
		addToConsole(summarised_message);
	
}

function consoleError(text) {	
        var errorString = '<span class="errorText">' + text + '</span>';
        consolePrint(errorString,true);
}
function clearConsole() {
	var code = document.getElementById('consoletextarea');
	code.innerHTML = '';
	var objDiv = document.getElementById('lowerarea');
	objDiv.scrollTop = objDiv.scrollHeight;
}

var clearConsoleClick = document.getElementById("clearConsoleClick");
clearConsoleClick.addEventListener("click", clearConsole, false);

function copyConsole() {
	// Reference: https://developers.google.com/web/updates/2018/03/clipboardapi
	var code = document.getElementById('consoletextarea');
	navigator.clipboard.writeText(code.innerHTML)
  		.then(() => {
    		console.log('Console copied to clipboard');
  		})
  		.catch(err => {
    		// This can happen if the user denies clipboard permissions:
    		console.error('Could not copy console: ', err);
  		});
}

var copyConsoleClick = document.getElementById("copyConsoleClick");
copyConsoleClick.addEventListener("click", copyConsole, false);