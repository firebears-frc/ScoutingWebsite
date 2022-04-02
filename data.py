import os
import sqlite3 as sql
import csv
import io
import requests
import datetime

try:
	with open("API_KEY",'r') as f:
		API_KEY = f.read()
except FileNotFoundError:
	API_KEY = None


api = None
# Dont change these
SCOUT_TABLE = "scouting"
SCOUT_TABLE_COLUMNS = [
	["time", "INT"],
	["team", "INT"],
	["match", "TEXT"],
	
	["highgoal", "INT"],
	["lowgoal", "INT"],
	
	["autohighgoal", "INT"],
	["autolowgoal", "INT"],
	
	["crossedline", "INT"],
	
	["drops", "INT"],
	["rung", "INT"],
	
	["goal", "INT"], 

	["notes", "TEXT"],
]

class TBA_API:
	def __init__(self, team, key=API_KEY):
		self.key = key or ""
		if type(team) is int or team.isdigit():
			self.team = team
		else:
			self.team = 2846

		self.comps = None
		self.current_comp = None
		self.matches = None

	def get_comps(self):
		curdate = datetime.datetime.now()
		if self.comps is None:
			headers = {
				"accept":"application/json",
				"X-TBA-Auth-Key":self.key
			}
			req = requests.get("https://www.thebluealliance.com/api/v3/team/frc"+str(self.team)+"/events/"+str(curdate.year)+"/simple", headers=headers)
			if req.status_code == 200:
				self.comps = req.json()
			else:
				print(req)
		return self.comps
		

	def get_current_comp(self):
		self.get_comps()
		if self.comps:
			curdate = datetime.datetime.now()
			self.current_comp = None
			for i in self.comps:
				startd = datetime.datetime.strptime(i["start_date"],"%Y-%m-%d")
				endd = datetime.datetime.strptime(i["end_date"],"%Y-%m-%d")
				if (startd.month <= curdate.month <= endd.month and startd.day <= curdate.day <= endd.day) or True:
					self.current_comp = i
					return self.current_comp
		


	def get_matches(self, comp):
		if self.matches is None:
			headers = {
				"accept":"application/json",
				"X-TBA-Auth-Key":self.key
			}
			req = requests.get("https://www.thebluealliance.com/api/v3/event/"+comp+"/matches/simple", headers=headers)
			if req.status_code == 200:
				self.matches = req.json()
			else:
				print("fail",req.text)
		return self.matches


	"""
		Get qualifying match number {mnum}
	"""
	def get_match(self, mnum):
		cc = self.get_current_comp()
		if cc:
			ms = self.get_matches(cc["key"])
			if ms:
				for i in ms:
					if i["comp_level"] == "qm" and int(i["match_number"]) == int(mnum):
						return i




"""
	Read Scouting Data
"""
class ScoutingData:
	def __init__(self, fname, save=True, **kwargs):
		create_tbl = not os.path.exists(fname)
		#print(create_tbl, fname)
			
		self.params = kwargs
		self.con = sql.connect(fname)
		self.cur = self.con.cursor()
		self.save = save

		if create_tbl:
			self.cur.execute("CREATE TABLE "+SCOUT_TABLE+" ("+",".join([" ".join(i) for i in SCOUT_TABLE_COLUMNS])+")")

	def __enter__(self):
		return self

	def __exit__(self,*args, **kwargs):
		#print(args)
		#print(kwargs)
		self.cleanup(self.save)

	"""
		Returns string with csv data 
	"""
	def export_as_csv(self, outfname="output.csv"):
		data = self.cur.execute("SELECT rowid, * FROM "+SCOUT_TABLE)
		output = io.StringIO()

		#with open(outfname, 'w', newline='') as fp:
		writer = csv.writer(output, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
		writer.writerow([x[0] for x in [("id","INT")]+SCOUT_TABLE_COLUMNS])
		for i in data:
			writer.writerow(i)
		return output.getvalue()

	"""
		Commits changes to sql database and closes connection
	"""
	def cleanup(self, save=None):
		if save or (save is None and self.save):
			#print("commited")
			self.con.commit()
		self.con.close()		
	
	"""
		Return list of dictionaries of data, see SCOUT_TABLE_COLUMNS for keys
	"""
	def get_data(self, team="%"):
		if team.isdigit():
			dat = self.cur.execute("SELECT rowid, * FROM "+SCOUT_TABLE+" WHERE team = ?", (team,)).fetchall()
		else:
			dat = self.cur.execute("SELECT rowid, * FROM "+SCOUT_TABLE+" WHERE team LIKE ?", (team,)).fetchall()

		ret = []
		for i in dat:
			row = {}
			row["rowid"] = i[0]
			for x,y  in zip(SCOUT_TABLE_COLUMNS,i[1:]):
				row[x[0]] = y
			ret.append(row)
		return ret


	"""
		Returns list of all teams in sql database
	"""
	def get_teamlist(self):
		teams = self.cur.execute("SELECT team FROM "+SCOUT_TABLE).fetchall()
		teamset = set()
		for i in teams:
			teamset.add(i[0])
		return list(teamset)

	"""
		Inserts new entry into sql database, checks against SCOUT_TABEL_COLUMNS
	"""
	def add_data(self, **kwargs):
		#if int(kwargs.get("time",0)) <= datetime.datetime.now().timestamp():
		#print("INSERT INTO "+SCOUT_TABLE+" ("+("?, "*len(SCOUT_TABLE_COLUMNS))[:-2]+")")
		#print(*[str(kwargs.get(x[0])) for x in SCOUT_TABLE_COLUMNS])
		self.cur.execute(
			"INSERT INTO "+SCOUT_TABLE+" VALUES ("+("?, "*len(SCOUT_TABLE_COLUMNS))[:-2]+")", 
			tuple([str(kwargs.get(x[0])) for x in SCOUT_TABLE_COLUMNS]), #*tuple([str(kwargs.get(x[0] for x in SCOUT_TABLE_COLUMNS))])
		)
	"""
		Overwrites entry in sql database
	"""
	def patch_data(self, rowid, **data):
		collist = ""
		colset = []
		#print("PP DATA",data)
		for key,_ in SCOUT_TABLE_COLUMNS:
			if data.get(key) is not None:
				collist += key+" = ?, "
				colset.append(key)
			else:
				pass #print(data,key)
		#print("RUNNING",collist)
		self.cur.execute(
			"UPDATE "+SCOUT_TABLE+" SET " + collist[:-2] + "WHERE rowid = ?", 
			tuple([str(data.get(x)) for x in colset]) + (rowid,)
		)

	


"""
	Standard file name from team number
"""
def fname(teamnum, comp=""):
	return "Scout"+str(teamnum)+str(comp)+".sqlite3"

def get_api():
	global api
	if api:
		return api
	api = TBA_API(2846)
	return api
