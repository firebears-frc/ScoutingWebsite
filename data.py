import os
import sqlite3 as sql
import csv
import io


# Dont change these
SCOUT_TABLE = "scouting"
SCOUT_TABLE_COLUMNS = [
	["time", "INT"],
	["team", "INT"],
	["match", "TEXT"],
	#["cycles", "INT"],
	
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



"""
	Read Scouting Data
"""
class ScoutingData:
	def __init__(self, fname, save=True, **kwargs):
		create_tbl = not os.path.exists(fname)
		print(create_tbl, fname)
			
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

	def export_as_csv(self, outfname="output.csv"):
		data = self.cur.execute("SELECT rowid, * FROM "+SCOUT_TABLE)
		output = io.StringIO()

		#with open(outfname, 'w', newline='') as fp:
		writer = csv.writer(output, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
		writer.writerow([x[0] for x in [("id","INT")]+SCOUT_TABLE_COLUMNS])
		for i in data:
			writer.writerow(i)
		return output.getvalue()

	def cleanup(self, save=None):
		if save or (save is None and self.save):
			print("commited")
			self.con.commit()
		self.con.close()		
	

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

	def get_teamlist(self):
		teams = self.cur.execute("SELECT team FROM "+SCOUT_TABLE).fetchall()
		teamset = set()
		for i in teams:
			teamset.add(i[0])
		return list(teamset)

	def add_data(self, **kwargs):
		#if int(kwargs.get("time",0)) <= datetime.datetime.now().timestamp():
		print("INSERT INTO "+SCOUT_TABLE+" ("+("?, "*len(SCOUT_TABLE_COLUMNS))[:-2]+")")
		print(*[str(kwargs.get(x[0])) for x in SCOUT_TABLE_COLUMNS])
		self.cur.execute(
			"INSERT INTO "+SCOUT_TABLE+" VALUES ("+("?, "*len(SCOUT_TABLE_COLUMNS))[:-2]+")", 
			tuple([str(kwargs.get(x[0])) for x in SCOUT_TABLE_COLUMNS]), #*tuple([str(kwargs.get(x[0] for x in SCOUT_TABLE_COLUMNS))])
		)

	def patch_data(self, rowid, **data):
		collist = ""
		colset = []
		for key,_ in SCOUT_TABLE_COLUMNS:
			if data.get(key):
				collist += key+" = ?, "
				colset.append(key)
		self.cur.execute(
			"UPDATE "+SCOUT_TABLE+" SET " + collist[:-2] + "WHERE rowid = ?", 
			tuple([str(data.get(x)) for x in colset]) + (rowid,)
		)



def fname(teamnum, comp=""):
	return "Scout"+str(teamnum)+str(comp)+".sqlite3"




