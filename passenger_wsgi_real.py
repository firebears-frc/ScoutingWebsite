# passenger_wsgi.py 
# uses TABS

import os
import sys
import time
import importlib as imp
import traceback
from urllib.parse import parse_qs

# More comments
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
stat = os.path.dirname(os.path.abspath(__file__))
errorpage = """
<!DOCTYPE html>
<html>
	<head>
		<title>FRC Stats - {0} Error</title>
	</head>
	<body>
		{0} Error
	</body>
</html>
"""
def contains(l,i,el=None):
	try:
		if el is None:
			return l.index(i) not in (None,-1)
		elif type(el) == int:
			for x in l:
				if type(x) == list and len(x)-1 >=el:
					if i == x[el]:
						return True
			return False
	except ValueError:
		return False


def scontains(l,i):
	for x in l:
		if x[0] == i:
			return True
	return False


def ldir(d):
	""" Useless """
	with open("backlist.txtB",'r') as f:
		bl = f.read().replace("\r",'').split("\n")
	l = os.listdir(d)
	r = []
	print(bl)
	for i in l:
		if i not in bl:
			r.append(i)
	return r




def application(environ, start_response):
	#with open("acceptable_extensions.txtB","r") as f:
	#	accept_exts = f.read().replace("\r","").split("\n")
	#ctype_ext = {}
	#accept_extension = []
	#for i in accept_exts:
	#	if len(i.split("=")) == 2:
	#		a,b = i.split("=")
	#	else:
	#		a = i
	#		b = "text/plain"
	#	ctype_ext[a] = b
	#	accept_extension.append(a)

	#print(environ["HTTP_USER_AGENT"])
	method = environ["REQUEST_METHOD"].lower()
	query = parse_qs(environ["QUERY_STRING"])
	try:
		surl = environ["PATH_INFO"].split("/")[-1]
	except IndexError:
		start_response('400 Bad Request', [('Content-Type', 'text/plain')])
		return ["Error 400 - Bad Request".encode()]
	except KeyError as kerr:
		print(traceback.print_tb(kerr.__traceback__))
		try:
			surl = environ["SCRIPT_URL"].split("/")[-1]
		except Exception as err:
			print(traceback.print_tb(err.__traceback__))
			start_response('500 Internal Error', [('Content-Type', 'text/plain')])
			return ["500 Internal Error - KeyError".encode("UTF-8")]
	
	if surl == "data_api" or surl == "/data_api":
		import data_api
		if method == "get":
			code,headers,data = data_api.simp_get(**query)
		elif method == "post":
			#print(environ["wsgi.input"].read())
			fdata = environ["wsgi.input"].read()
			code,headers,data = data_api.simp_post(fdata,**query)
		start_response(str(code), headers)
		return [data]

	elif surl == "view":
		import view_page
		code, headers, data = view_page.simp_get(**query)
		start_response(str(code), headers)
		return [data]
	
	elif surl == "scout" or surl == "/" or surl == "":
		import scout_page
		code, headers, data = scout_page.simp_get(**query)
		start_response(str(code), headers)
		return [data]
	else:
		ppath = os.path.basename(surl)
		if os.path.exists(ppath) and not ppath.endswith("py"):
			with open(ppath,"rb") as f:
				data = f.read()
			if ppath.endswith("css"):
				headers = [('Content-Type', 'text/css')]	
			elif ppath.endswith("html"):
				headers = [('Content-Type', 'text/plain')]	
			elif ppath.endswith("js"):
				headers = [('Content-Type', "application/javascript")]	
			
			start_response("200 OK", headers)
			return [data]

		print("ppath",ppath)
		#if os.path.exists(surl):
			

	print(surl,environ)
	start_response('500 Internal Error', [('Content-Type', 'text/plain')])
	fff = "Failed"
	return [fff.encode("UTF-8")]

