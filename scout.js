var drops = 0;
let highgoal = 0;
let lowgoal = 0;
let autohighgoal = 0;
let autolowgoal = 0;
let crossedline = 0;

var team = 0;

var climbed = false;
var hub = false;
var ball = false;


function addDrop(x) {
	drops += x;
	if ( drops < 0) drops = 0;
	var lab = document.getElementById("dropLabel");
	lab.textContent = drops;
}
function addHigh(x) {
	highgoal += x;
	if ( highgoal < 0) highgoal = 0;
	var lab = document.getElementById("highgoalLabel");
	lab.textContent = highgoal;
}

function addLow(x) {
	lowgoal += x;
	if ( lowgoal < 0) lowgoal = 0;
	var lab = document.getElementById("lowgoalLabel");
	lab.textContent = lowgoal;
}

function addAutoHigh(x) {
	autohighgoal += x;
	if ( autohighgoal < 0) autohighgoal = 0;
	var lab = document.getElementById("hgautoLabel");
	lab.textContent = autohighgoal;
}

function addAutoLow(x) {
	autolowgoal += x;
	if ( autolowgoal < 0) autolowgoal = 0;
	var lab = document.getElementById("lgautoLabel");
	lab.textContent = autolowgoal;
}

function toggleClimb() {
	var el = document.getElementById("climbBtn");
	climbed = !climbed;
	if ( climbed ) {
		el.style.backgroundColor = "green";
	} else {
		el.style.backgroundColor = "red";
	}
}


function submit() {
	let time = new Date();
	
	let team = document.getElementById("teamInput").value;
	let match = document.getElementById("matchInput").value;
	let notes = document.getElementById("notesInput").value;
	let rung = document.getElementById("rungSelect").value;

	let utcstamp = Math.floor(time.getTime()/1000); // + time.getTimezoneOffset()*60;
	data = {
		req:"append",
		time:utcstamp,
		team:team,
		match:match,
		highgoal:highgoal,
		lowgoal:lowgoal,
		autohighgoal:autohighgoal,
		autolowgoal:autolowgoal,
		crossedline:crossedline,
		rung:rung,
		goal:hub,
		drops:drops,
		notes:notes,
	};
	console.log(data);
	


	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			console.log(xhr.status);
			console.log(xhr.response);
			if (xhr.status == 200) {
				addDrop(-drops);
				addHigh(-highgoal);
				addLow(-lowgoal);
				addAutoHigh(-autohighgoal);
				addAutoLow(-autolowgoal);
				document.getElementById("teamInput").value = "";
				document.getElementById("matchInput").value = "";
				document.getElementById("rungSelect").value = 0;
				document.getElementById("notesInput").value = "";
				setAutoLine(false);
			}
		}
	}
	xhr.open('POST', "/data_api", true);
	xhr.send(JSON.stringify(data));
}


function rungUpdate(event) {
	if (event.target.value > 0) {
		document.getElementById("rungRangeLabel").textContent = event.target.value;
	} else {
		document.getElementById("rungRangeLabel").textContent = "No Climb";
	}
}




function setHub(isUpperHub) {
	hub = !hub;
	console.log("aaa"+isUpperHub);
	if (isUpperHub == 1) {
		document.getElementById("lowerHubBtn").setAttribute("class","toggleBtn btnOff");
		document.getElementById("upperHubBtn").setAttribute("class", "toggleBtn btnOn");

		document.getElementById("lowerHubBtn").textContent = "Low";
		document.getElementById("upperHubBtn").textContent = "High ✔";
	} else {
		document.getElementById("lowerHubBtn").setAttribute("class","toggleBtn btnOn");
		document.getElementById("upperHubBtn").setAttribute("class", "toggleBtn btnOff");
		
		document.getElementById("lowerHubBtn").textContent = "Low ✔";
		document.getElementById("upperHubBtn").textContent = "High";
	}
}

function setBall(isBall) {
	ball = !ball;
	if (isBall == 1) {
		document.getElementById("1BallBtn").setAttribute("class","toggleBtn btnOff");
		document.getElementById("2BallBtn").setAttribute("class", "toggleBtn btnOn");

		document.getElementById("1BallBtn").textContent = "1";
		document.getElementById("2BallBtn").textContent = "2 ✔";
	} else {
		document.getElementById("1BallBtn").setAttribute("class","toggleBtn btnOn");
		document.getElementById("2BallBtn").setAttribute("class", "toggleBtn btnOff");
		
		document.getElementById("1BallBtn").textContent = "1 ✔";
		document.getElementById("2BallBtn").textContent = "2";
	}
	console.log(ball);
}

function setAutoLine(newline) {
	crossedline = newline;
	if (crossedline == 1) {
		document.getElementById("AutoLineBtn").setAttribute("class","toggleBtn btnOn");
		document.getElementById("AutoLineBtn").textContent = "Yes";
	} else {
		document.getElementById("AutoLineBtn").setAttribute("class","toggleBtn btnOff");
		document.getElementById("AutoLineBtn").textContent = "No";
	}
}

let timerStart = 0;
document.getElementById("timerBtn").addEventListener("click", function() {
	let counting = !(this.getAttribute("counting")=="false");
	if (counting) {
		
	} else {
		
	}
	this.setAttribute("counting", !counting);
});

document.getElementById("timerBtn").setAttribute("counting","false");
//document.getElementById("rungRange",).addEventListener("input", rungUpdate);
//document.getElementById("lowerHubBtn").addEventListener("click", () => { setHub(!hub) });
//document.getElementById("upperHubBtn").addEventListener("click", () => { setHub(!hub) });

//document.getElementById("1BallBtn").addEventListener("click", () => { setBall(!ball) });
//document.getElementById("2BallBtn").addEventListener("click", () => { setBall(!ball) });

document.getElementById("AutoLineBtn").addEventListener("click", () => { setAutoLine(!crossedline) });
document.addEventListener('touchmove', function (event) {
  //if (event.scale !== 1) { event.preventDefault(); }
}, { passive: false });

var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  //alert(event.target);
  if (now - lastTouchEnd <= 300 && event.target.tagName != "BUTTON") {
    //event.preventDefault();
  }
  lastTouchEnd = now;
}, false);



