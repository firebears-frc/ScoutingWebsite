import json
from urllib.parse import urlparse, parse_qs

import data


TEAM = 2846

def handle_get(args, cookies, environ, start_response):
	idx = args.get("idx",0)
	# Auth
		

def handle_post(args, cookies, environ, start_response):
	pass


def simp_get(**query):

	team = 2846

	req = query.get("req",[None])[0]
	res = {"error":500, "message":"something went wrong"}
	ctype = "application/json"
	if req == "records":
		with data.ScoutingData(data.fname(TEAM)) as reader:
			print(query.get("team",['%'])[0])
			res = reader.get_data(query.get("team",['%'])[0])
	elif req == "teams":
		with data.ScoutingData(data.fname(TEAM)) as reader:
			res = {"teams":reader.get_teamlist()}
	elif req == "export":
		with data.ScoutingData(data.fname(TEAM)) as reader:
			res = reader.export_as_csv()
		ctype = "text/csv"
		#res = {"message":"success"}
	elif req == "metadata":
		res = {"columns":data.SCOUT_TABLE_COLUMNS}
	else:
		res = {"error":400, "message":"not valid request"}
	
	

	
	if ctype == "application/json":
		html = json.dumps(res).encode("utf-8")
	else:
		html = res.encode("utf-8")
	resp = 200
	head = [("Content-Type", ctype)]
	return resp, head, html	



def simp_post(filedata, **query):
	code = 500
	ret = json.dumps({"error":"server"}).encode("utf-8")
	args = json.loads(filedata)
	print(args)
	if args.get("req") == "patch":
		print("PATCH")
		print(args)
		all_fields = True
		clean_args = {}
		rowid = args.get("rowid")
		if rowid and rowid.isdigit():
			clean_args["rowid"] = rowid
			for key, ktype in data.SCOUT_TABLE_COLUMNS:
				value = args.get(key)
				if value is None:
					continue
				print(ktype,key,value)
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
		else:
			all_fields = False
			
		print(clean_args)
		if all_fields:
			with data.ScoutingData(data.fname(TEAM)) as writer:
				writer.patch_data(**clean_args)
		
			ret = json.dumps({"message":"success"}).encode("utf-8")
			code = 200
		else:
			ret = json.dumps({"message":"missing fields"}).encode("utf-8")
			code = 400
			

	elif args.get("req") == "delete":
		pass
	elif args.get("req") == "append":
		#data = args.get("data")


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

		if all_fields:
			with data.ScoutingData(data.fname(TEAM)) as writer:
				print(clean_args)
				writer.add_data(**clean_args)
		
			ret = json.dumps({"message":"success"}).encode("utf-8")
			code = 200
		else:
			ret = json.dumps({"message":"missing fields"}).encode("utf-8")
			code = 400
		
	headers = [("Content-Type", "application/json")]
	return code, headers, ret






