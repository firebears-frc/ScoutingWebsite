var drops = 0;
var cycles = 0;
var team = 0;
var climbed = false;


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
	var time = new Date();
	
	var team = document.getElementById("teamInput").value;
	var match = document.getElementById("matchInput").value;
	var notes = document.getElementById("notesInput").value;
	
	var utcstamp = Math.floor(time.getTime()/1000); // + time.getTimezoneOffset()*60;
	data = {
		time:utcstamp,
		team:team,
		match:match,
		cycles:cycles,
		climbed:climbed+0,
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
	console.log("aaa"+isUpperHub);
	if (isUpperHub == 1) {
		document.getElementById("lowerHubBtn").setAttribute("class","toggleBtn btnOff");
		document.getElementById("upperHubBtn").setAttribute("class", "toggleBtn btnOn");
	} else {
		document.getElementById("lowerHubBtn").setAttribute("class","toggleBtn btnOn");
		document.getElementById("upperHubBtn").setAttribute("class", "toggleBtn btnOff");
	}
}

//document.getElementById("rungRange",).addEventListener("input", rungUpdate);
document.getElementById("lowerHubBtn").addEventListener("click", () => { setHub(0) });
document.getElementById("upperHubBtn").addEventListener("click", () => { setHub(1) });

