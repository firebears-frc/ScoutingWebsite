var drops = 0;
var cycles = 0;
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
function addCycle(x) {
	cycles += x;
	if ( cycles < 0) cycles = 0;
	var lab = document.getElementById("cycleLabel");
	lab.textContent = cycles;
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
		time:utcstamp,
		team:team,
		match:match,
		cycles:cycles,
		rung:rung,
		goal:hub,
		drops:drops,
		notes:notes
	};
	console.log(data);
	


	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			console.log(xhr.response);
			addDrop(-drops);
			addCycle(-cycles);
			if ( climbed ) toggleClimb();
			document.getElementById("notesInput").value = "";
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
}


//document.getElementById("rungRange",).addEventListener("input", rungUpdate);
document.getElementById("lowerHubBtn").addEventListener("click", () => { setHub(!hub) });
document.getElementById("upperHubBtn").addEventListener("click", () => { setHub(!hub) });

document.getElementById("1BallBtn").addEventListener("click", () => { setBall(!ball) });
document.getElementById("2BallBtn").addEventListener("click", () => { setBall(!ball) });

document.addEventListener('touchmove', function (event) {
  if (event.scale !== 1) { event.preventDefault(); }
}, { passive: false });

var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  //alert(event.target);
  if (now - lastTouchEnd <= 300 && event.target.tagName != "BUTTON") {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);



