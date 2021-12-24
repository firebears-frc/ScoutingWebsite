
const isDigit = n => /^\d+$/.test(n)


var index = 0;
var curcomp = 'test';
var year = 2020;

//var data = [];

function get(team) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			data = JSON.parse(xhr.responseText);
			console.log(data[0]);

			//console.log(xhr.response);
		}
	}
	xhr.open('GET', "/data_api?team="+team, true);
	xhr.send();
}

function exportData() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			data = JSON.parse(xhr.responseText);
			console.log(data[0]);
		}
	}
	xhr.open('GET', "/data_api?req=export", true);
	xhr.send();
}



function getTeamList() {
	console.log("asd");
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			const data = JSON.parse(xhr.responseText);
			data["teams"].sort();
			var tlist = document.getElementById("teamList");
			while ( tlist.firstChild ) tlist.lastChild.remove();

			for ( var i=0; i<data["teams"].length; ++i ) {
				const teamnum = data["teams"][i];
				var nel = document.createElement("li");
				
				var btn = document.createElement("button");
				btn.textContent = data["teams"][i];
				btn.addEventListener("click", function (){
					requestRecords(teamnum);
				});
				
				nel.appendChild(btn);
				tlist.appendChild(nel);
			}
			
			console.log(data);
		}
	}
	xhr.open('GET', "/data_api?req=teams", true);
	xhr.send();
}


function getRecords(event) {
	event.preventDefault();
	var team = document.getElementById("teamFilter").value;
	requestRecords(team);
	return false;	
}

function sortBy(reverse, sortIdx, firstEl, lastEl) {
	if ( firstEl[sortIdx] < lastEl[sortIdx] ) {
		return 1 + (-2*reverse);
	} else if ( firstEl[sortIdx] > lastEl[sortIdx] ) {
		return -1 + (2*reverse);
	}
	return 0;
}

function getTeamData(data, team) {
	var res = {}
	for (var i=0; i<data.length; ++i) {
		if ( data[i] ) {
		}
	}
	
}



function requestRecords(team) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			const sby = document.getElementById("sortBy").value;
			const rev = document.getElementById("reverseSort").checked;
			console.log(rev);
			data = JSON.parse(xhr.responseText);
			data.sort((fel, lel) => { return sortBy(rev, sby, fel, lel); });
			var rlist = document.getElementById("recordListBody");
			var cycles = 0;
			while ( rlist.firstChild )
				rlist.lastChild.remove();

			var averages = {};
			



			for ( var i=0; i<data.length; ++i ) {
				var nrow = document.createElement("tr");
				
				// Time
				var col1 = document.createElement("td");
				var d = new Date(data[i][0]*1000);
				col1.textContent = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + ' ' + d.getHours() + ":" + d.getMinutes() + ':' + d.getSeconds();
				nrow.appendChild(col1);
				
				// Team
				var col2 = document.createElement("td");
				col2.textContent = data[i][1];
				nrow.appendChild(col2);
				
				// Cycles
				var col3 = document.createElement("td");
				col3.textContent = data[i][3];
				nrow.appendChild(col3);
				
				// Dropped
				var col4 = document.createElement("td");
				col4.textContent = data[i][4];
				nrow.appendChild(col4);
				
				var climbcol = document.createElement("td");
				if ( data[i][5] == 1 ) {
					climbcol.textContent = "yes";
				} else { 
					climbcol.textContent = "no";
				}
				nrow.appendChild(climbcol);
				
				// Notes
				var col5 = document.createElement("td");
				var tarea = document.createElement("textarea");
				tarea.readOnly = true;
				tarea.textContent = data[i][6];
				col5.appendChild(tarea)
				nrow.appendChild(col5);
				
				cycles += data[i][3];
				
				rlist.appendChild(nrow);
			}
			if ( team == '%' ) {
				document.getElementById("teamOut").innerText = "All Teams";
				document.getElementById("avgCycles").innerText = "Average Cycles N/A";
			} else {
				document.getElementById("teamOut").innerText = "Team "+team;
				document.getElementById("avgCycles").innerText = "Average Cycles " + Math.round(cycles / data.length);
			}
			console.log(data[0]);
		}
	}
	xhr.open('GET', "/data_api?req=records&team="+team, true);
	xhr.send();
}



function next() {
	return;
	var recordsEl = document.getElementById("recordList");
	
	var d = data[index];
	//div.

	index = (index + 1) % data.length;
}
function prev() {}
	

function submit(event) {
	event.preventDefault();
	
	
	var teamInput = document.getElementById("teamInput");
	
	var cyclesInput = document.getElementById("cyclesInput");
	var moveSelect = document.getElementById("moveSelect");
	var compSelect = document.getElementById("compSelect");
	var notesInput = document.getElementById("notesInput");
	var time = new Date();
	
	var utcstamp = Math.floor(time.getTime()/1000); // + time.getTimezoneOffset()*60;
	var cycles = cyclesInput.value;
	var move = moveSelect.value;
	var comp = compInput.value;
	var team = teamInput.value;
	var notes = notesInput.value;

	//var filters = "";
	//filters += "cycle:"+cycle.value+";";
	//filters += "move:"+move.value;
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			var div = document.getElementById("data_viewer");
			console.log(xhr.response);
		}
	}	
	
	data = {
		time:utcstamp,
		team:team,
		comp:comp,
		cycles:cycles,
		movement:move,
		notes:notes
	};
	console.log(data);
	xhr.open('POST', "/data_api", true);
	xhr.send(JSON.stringify(data));
	//"/data_api?comp="+comp+"&year="+year+"&idx="+index, 

	return false;
}

document.getElementById("dataform").addEventListener("submit", submit);
document.getElementById("viewForm").addEventListener("submit", getRecords);


