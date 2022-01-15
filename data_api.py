import json
from urllib.parse import urlparse, parse_qs

import data

def handle_get(args, cookies, environ, start_response):
	idx = args.get("idx",0)
	# Auth
		

def handle_post(args, cookies, environ, start_response):
	pass


def simp_get(**query):

	team = 2846

	req = query.get("req",[None])[0]
	res = {"error":500, "message":"something went wrong"}

	if req == "records":
		with data.ScoutingData("scouting"+str(team)+".db") as reader:
			print(query.get("team",['%'])[0])
			res = reader.get_data(query.get("team",['%'])[0])
	elif req == "teams":
		with data.ScoutingData("scouting"+str(team)+".db") as reader:
			res = {"teams":reader.get_teamlist()}
	elif req == "export":
		with data.ScoutingData("scouting"+str(team)+".db") as reader:
			reader.export_as_csv()
		res = {"message":"success"}
	elif req == "metadata":
		res = {"columns":data.SCOUT_TABLE_COLUMNS}
	else:
		res = {"error":400, "message":"not valid request"}
	
	

	
	
	html = json.dumps(res).encode("utf-8")
	resp = 200
	head = [("Content-Type", "application/json")]
	return resp, head, html	

def simp_post(filedata, **query):
	args = json.loads(filedata)
	#args = parse_qs(data.decode("utf-8"))
	print(args)	

	all_fields = True
	clean_args = {}
	for key, ktype in data.SCOUT_TABLE_COLUMNS:
		value = args.get(key)
		if ktype.lower() == "int":
			try:
				clean_args[key] = int(value)
			except ValueError:
				all_fields = False
				break
		elif ktype.lower() == "text":
			if value.isprintable():
				clean_args[key] = value
			else:
				all_fields = False
				break
	headers = [("Content-Type", "application/json")]

	if all_fields:
		with data.ScoutingData(data.fname(2846)) as writer:
			print(clean_args)
			writer.add_data(**clean_args)
	
		ret = json.dumps({"message":"success"}).encode("utf-8")
		code = 200
	else:
		ret = json.dumps({"message":"missing fields"}).encode("utf-8")
		code = 400
		

	return code, headers, ret







