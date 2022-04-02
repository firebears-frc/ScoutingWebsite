
const isDigit = n => /^\d+$/.test(n)


var index = 0;
var year = 2022;
let halloffame = [];
//var data = [];

function exportData() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			const dataUrl = "data:text/csv;charset=utf-8,"+encodeURIComponent(xhr.responseText);
			const download = document.createElement("a");
			download.href = dataUrl
			const d = new Date();
			download.download = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" ScoutingData.csv";
			document.body.appendChild(download);
			download.click();
			download.remove();
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
			var tlist = document.getElementById("teamSelect");
			while ( tlist.firstChild ) tlist.lastChild.remove();
			var fel = document.createElement("option");
			fel.textContent = "All";
			fel.selected = true;
			tlist.appendChild(fel);

			for ( var i=0; i<data["teams"].length; ++i ) {
				const teamnum = data["teams"][i];
				var nel = document.createElement("option");
				nel.textContent = data["teams"][i];
				tlist.appendChild(nel);
			}
			console.log(data);
		}
	}
	xhr.open('GET', "/data_api?req=teams", true);
	xhr.send();
	if (document.getElementById("teamSelect").value.toLowerCase() == "all") {
		requestRecords("%");
	} else {
		requestRecords(document.getElementById("teamSelect").value);
	}
}
function teamSelectChange(event) {
	console.log(event.target.value);
	if (event.target.value.toLowerCase() == "all") {
		requestRecords("%");
	} else {
		requestRecords(event.target.value);
	}
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

function populateRecordsTable(data) {
	let rlist = document.getElementById("recordListBody");
	let averages = {};
	averages.highgoal = 0;
	averages.lowgoal = 0;
	averages.drops = 0;
	averages.rung = 0;

	


	while ( rlist.firstChild )
		rlist.lastChild.remove();

	for ( var i=0; i<data.length; ++i ) {
		console.log(data[i]);
		var nrow = document.createElement("tr");
		

		var rowidcol = document.createElement("td");
		rowidcol.setAttribute("header","rowid");
		rowidcol.textContent = data[i].rowid;
		nrow.appendChild(rowidcol);
		
		// Time
		var timecol = document.createElement("td");
		var d = new Date(data[i].time*1000);
		timecol.textContent = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + ' ' + d.getHours() + ":" + d.getMinutes() + ':' + d.getSeconds();
		nrow.appendChild(timecol);
		
		// Team
		var teamcol = document.createElement("td");
		teamcol.setAttribute("header","team");
		var teamtarea = document.createElement("input");
		teamtarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		teamtarea.size = 5;
		teamtarea.value = data[i].team;
		teamcol.appendChild(teamtarea);
		nrow.appendChild(teamcol);
		
		var matchcol = document.createElement("td");
		matchcol.setAttribute("header","match");
		var matchtarea = document.createElement("input");
		matchtarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		matchtarea.size = 5;
		matchtarea.value = data[i].match;
		matchcol.appendChild(matchtarea);
		nrow.appendChild(matchcol);
		
		var highgoalcol = document.createElement("td");
		highgoalcol.setAttribute("header","highgoal");
		var hgoaltarea = document.createElement("input");
		hgoaltarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		hgoaltarea.size = 5;
		hgoaltarea.value = data[i].highgoal;
		highgoalcol.appendChild(hgoaltarea);
		nrow.appendChild(highgoalcol);
		
		var lowgoalcol = document.createElement("td");
		lowgoalcol.setAttribute("header","lowgoal");
		var lgoaltarea = document.createElement("input");
		lgoaltarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		lgoaltarea.size = 5;
		lgoaltarea.value = data[i].lowgoal;
		lowgoalcol.appendChild(lgoaltarea);
		nrow.appendChild(lowgoalcol);


		var highautocol = document.createElement("td");
		highautocol.setAttribute("header","autohighgoal");
		var hautotarea = document.createElement("input");
		hautotarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		hautotarea.size = 5;
		hautotarea.value = data[i].autohighgoal;
		highautocol.appendChild(hautotarea);
		nrow.appendChild(highautocol);
		
		var lowautocol = document.createElement("td");
		lowautocol.setAttribute("header","autolowgoal");
		var lautotarea = document.createElement("input");
		lautotarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		lautotarea.size = 5;
		lautotarea.value = data[i].autolowgoal;
		lowautocol.appendChild(lautotarea);
		nrow.appendChild(lowautocol);



		var crossedlinecol = document.createElement("td");
		crossedlinecol.setAttribute("header","crossedline");
		var crossedlinetarea = document.createElement("input");
		crossedlinetarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		crossedlinetarea.size = 5;
		crossedlinetarea.value = data[i].crossedline == 1;
		crossedlinecol.appendChild(crossedlinetarea);
		nrow.appendChild(crossedlinecol);





		// Dropped
		var dropscol = document.createElement("td");
		dropscol.setAttribute("header","drops");
		var dropstarea = document.createElement("input");
		dropstarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		dropstarea.size = 5;
		dropstarea.value = data[i].drops;
		dropscol.appendChild(dropstarea);
		nrow.appendChild(dropscol);
		
		// Rung
		var rungcol = document.createElement("td");
		rungcol.setAttribute("header","rung");
		var rungtarea = document.createElement("input");
		rungtarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		rungtarea.size = 5;
		rungtarea.value = data[i].rung;
		rungcol.appendChild(rungtarea);
		nrow.appendChild(rungcol);
		
		// Notes
		var notescol = document.createElement("td");
		notescol.setAttribute("header","notes");
		var tarea = document.createElement("textarea");
		tarea.addEventListener("input", function() {
			this.parentElement.parentElement.getElementsByTagName("button")[0].hidden = false;
		});
		//tarea.readOnly = true;
		tarea.value = data[i].notes;
		notescol.appendChild(tarea)
		nrow.appendChild(notescol);
		

		var btncol = document.createElement("td");
		let applybtn = document.createElement("button");
		applybtn.setAttribute("id","applybtn");
		applybtn.hidden = true;
		applybtn.textContent = "✓";
		applybtn.onclick = function() {
			const row = this.parentElement.parentElement;
			let patchdata = {}
			for (let i=0; i<row.children.length; ++i) {
				const header = row.children[i].getAttribute("header");
				if (header) {
					let pval;
					if (header == "notes") {
						pval = row.children[i].getElementsByTagName("textarea")[0].value;
					} else if (header == "rowid") {
						pval = row.children[i].textContent;		
					} else if (header == "crossedline") {
						pval = row.children[i].getElementsByTagName("input")[0].value;
						if (pval.toLowerCase() == "true" || pval > 0) {
							pval = 1;
						} else {
							pval = 0;
						}
					} else {
						pval = row.children[i].getElementsByTagName("input")[0].value;
					}
					patchdata[header] = pval;
				}
			}
			/*
			let patchdata = {
				rowid:rowidcol.textContent,
				team:teamtarea.value,
				match:matchtarea.value,
				highgoal:hgoaltarea.value,
				lowgoal:lgoaltarea.value,
				drops:dropstarea.value,
				rung:rungtarea.value,
				notes:tarea.value,
			}*/
			console.log("PATCHING");
			console.log(patchdata);
			patchRow(patchdata);
			//console.log(teamtarea.value);
			this.hidden = true;
		}
		btncol.appendChild(applybtn);
		nrow.appendChild(btncol);
	
		averages.highgoal += data[i].highgoal;
		averages.lowgoal += data[i].lowgoal;
		averages.drops += data[i].drops;
		averages.rung += data[i].rung;

		
		rlist.appendChild(nrow);
	}
	return averages;
}


function graph(data, key) {
	const xbox = 100;
	const ybox = 100;
	const botzone = 10;

	let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("width", 100);
	svg.setAttribute("height", 100);
	svg.setAttribute("id", key+"Graph");
	svg.setAttribute("fill", "none");
	svg.setAttribute("viewBox", "0 0 "+xbox+" "+(ybox+5));
	svg.setAttribute("stroke", "black");

	let polyline = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
	let pts = "";
	let maxy = 0;
	let miny = 0;
	for (let i=0; i<data.length; ++i) {
		maxy = Math.max(data[i][key], maxy);
		//miny = Math.min(data[i][key], miny);
	}
	--miny;
	++maxy;

	for (let i=0; i<data.length; ++i) {
		pts += i/data.length * xbox + ", " + (ybox-(data[i][key]-miny) / (maxy-miny) * (ybox-botzone) - botzone) + " ";
	}
	polyline.setAttribute("points",	pts);

	svg.appendChild(polyline);
	
	let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("style", "font: normal 16px monospace; text-anchor: middle; fill: black");
	text.setAttribute("x", "50%");
	text.setAttribute("y", ybox);
	//text.setAttribute("textLength","100%");
	text.textContent = key;

	svg.appendChild(text);

	
	

	return svg;
}



function requestRecords(team) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			const sby = document.getElementById("sortBy").value;
			const rev = document.getElementById("reverseSort").checked;
			console.log(rev);
			console.log(xhr.responseText);
			data = JSON.parse(xhr.responseText);
			data.sort((fel, lel) => { return sortBy(rev, sby, fel, lel); });
			var rlist = document.getElementById("recordListBody");
			var cycles = 0;

	


			let averages = populateRecordsTable(data);

			let avgDiv = document.getElementById("averages");

			while ( avgDiv.firstChild )
				avgDiv.lastChild.remove();
			for (const [key, value] of Object.entries(averages)) {
				console.log(key);
				console.log(value)
				let avgEnt = document.createElement("div");
				avgEnt.textContent = key+": "+(Math.round(value/data.length*10)/10);
				avgDiv.appendChild(avgEnt);
			}
			let hgsvg = graph(data, "highgoal");
			avgDiv.appendChild(hgsvg);
			
			let lgsvg = graph(data, "lowgoal");
			avgDiv.appendChild(lgsvg);
			
			let dropsvg = graph(data, "drops");
			avgDiv.appendChild(dropsvg);
			
			let rungsvg = graph(data, "rung");
			avgDiv.appendChild(rungsvg);
			
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


function patchRow(data) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			console.log(xhr.response);
		}
	}
	data.req = "patch";
	xhr.open('POST', "/data_api", true);
	console.log(data);
	xhr.send(JSON.stringify(data));
	return false;
}


function renderHallOfFame(newhof) {
	halloffame = newhof;
	let topTeams = {};
	for (let i=0; i<halloffame.length; ++i) {
		for (key in halloffame[i]) {
			if (halloffame[i].hasOwnProperty(key)) {
				if (topTeams[key] == undefined || topTeams[key]["value"] < halloffame[i][key][0]) {
					topTeams[key] = {team:halloffame[i]["team"], value:halloffame[i][key]};
				}
			}
		}
	}
	console.log(topTeams);

}



function reloadHallOfFame() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 ) {
			data = JSON.parse(xhr.responseText);
			console.log(data);
			let sums = {};
			let teamsums = {};
			for (let i=0; i<data.length; ++i) {
				for(var key in data[i]) {
					if(data[i].hasOwnProperty(key)) { //to be safe
						if (key != "time" && key != "notes" && key != "match" && key != "team") {
							if (sums[key]) {
								sums[key] += data[i][key];
							} else {
								sums[key] = data[i][key];
							}
							console.log("DATA");
							console.log(data[i])
							if (teamsums[data[i]["team"]] == undefined)
								teamsums[data[i]["team"]] = {num:0};
							
							if (teamsums[data[i]["team"]][key]) {
								teamsums[data[i]["team"]][key] += data[i][key];
							} else {
								teamsums[data[i]["team"]][key] = data[i][key];
							}
						}
					}
				}
				teamsums[data[i]["team"]].num++;
			}
			let sdsums = {};
			let tlist = [];
			for(var team in teamsums) {
				let ret = {team:team};
				for (var key in teamsums[team]) {
					if (key != "num") {
						if (sdsums[key]) {
							sdsums[key] += Math.abs(teamsums[team][key]/teamsums[team]["num"] - sums[key]/data.length);
						} else {
							sdsums[key] = Math.abs(teamsums[team][key]/teamsums[team]["num"] - sums[key]/data.length);
						}
						ret[key] = [
							(teamsums[team][key]/teamsums[team]["num"] - sums[key]/data.length) / sums[key]/data.length * 100,
							teamsums[team][key]/teamsums[team]["num"]
						];
					}
				}
				tlist.push(ret);
			}
			renderHallOfFame(tlist);

			for (var key in sdsums) {
				break;
				sdsums[key] = sdsums[key]/Object.keys(teamsums).length;
			}
			console.log(sums);
			console.log(teamsums);
			console.log(sdsums);
		}
	}
	xhr.open('GET', "/data_api?req=records&team=%", true);
	xhr.send();
	

}





function sortTable(header) {
	const tbl = document.getElementById("recordListBody");

}









function sortTable(header) {
	const tbl = document.getElementById("recordListBody");
	

	
}













document.getElementById("dataform").addEventListener("submit", submit);
document.getElementById("viewForm").addEventListener("submit", getRecords);
document.getElementById("teamSelect").addEventListener("change", teamSelectChange);
getTeamList();

document.getElementById("timeSortBtn").addEventListener("click", () => { sortTable("time"); });



