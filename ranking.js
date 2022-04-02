let columns = null;

async function getColumns() {
	let params = {method: "GET"};
	let url = new URL("/data_api",window.location.origin);
	url.searchParams.append("req","metadata");

	let response = await fetch(url, params);
	let res  = await response.json();
	console.log(res["columns"]);
	columns = res["columns"];
	//.result["columns"];

	/*let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4) {
			const retdata = JSON.parse(xhr.responseText);
			if (xhr.status == 200 && retdata.columns) columns = retdata.columns;
		}
	}
	xhr.open("GET","/data_api?req=metadata",false);
	xhr.send();*/
}



async function getTeamData(team) {
	let params = {method: "GET"};
	let url = new URL("/data_api",window.location.origin);
	url.searchParams.append("req","records");
	url.searchParams.append("team",team);
	let response = await fetch(url, params);
	return await response.json();
}

async function loadTeamNumbers(match) {
	let params = {method: "GET"};
	let url = new URL("/data_api",window.location.origin);
	url.searchParams.append("req", "match");
	url.searchParams.append("match", match);
	let response = await fetch(url, params);
	let jres = await response.json();
	console.log(jres.alliances["blue"].team_keys);
	for (let i=0;i<6; ++i) {
		let c = ((i<3) ? "red" : "blue");
		let tnum = jres.alliances[c].team_keys[i%3].substr(3,4);
		document.getElementById(c+"Team"+(i%3)).value = tnum;
	}
}

function clearChildren(el) {
	while (el.firstChild) el.lastChild.remove();
}

async function populateView(view, team) {
	console.log(view);
	let tbody = view.getElementsByTagName("tbody")[0];
	let thead = view.getElementsByTagName("thead")[0];
	clearChildren(tbody);
	clearChildren(thead);

	let data = await getTeamData(team);
	if (columns == null) await getColumns();
	
	let headRow = document.createElement("tr");
	thead.appendChild(headRow);
	for (let i=0; i<columns.length; ++i) {
		let col = document.createElement("td");
		col.textContent = columns[i][0];
		headRow.appendChild(col);
	}

	for (let i=0; i<data.length; ++i) {
		let row = document.createElement("tr");
		for (let ci=0; ci<columns.length; ++ci) {
			let cell = document.createElement("td");
			cell.textContent = data[i][columns[ci][0]];
			row.appendChild(cell);
		}
		tbody.appendChild(row);
	}
}


async function loadTeamData() {
	let redTeams = [];
	let blueTeams = [];
	for (let i=0;i<3;++i) {
		populateView(
			document.getElementById("redTeamView"+i),
			document.getElementById("redTeam"+i).value
		);
		populateView(
			document.getElementById("blueTeamView"+i),
			document.getElementById("blueTeam"+i).value
		);
	}
	document.getElementById("teamViews").classList.remove("no-print");
}

async function reloadTable() {
	populateView(document.getElementById("recordList"),"%");
	document.getElementById("recordList").classList.remove("no-print");
}


document.getElementById("redTeamViews").appendChild(document.createTextNode("Red Teams"));
document.getElementById("blueTeamViews").appendChild(document.createTextNode("Blue Teams"));
for (let i=0;i<6; ++i) {
	let c = ((i<3) ? "red" : "blue")
	let table = document.createElement("table");
	table.classList.add("teamView");

	table.appendChild(document.createElement("thead"));
	table.appendChild(document.createElement("tbody"));
	table.setAttribute("id",c+"TeamView"+(i%3));
	document.getElementById(c+"TeamViews").appendChild(table);
}





