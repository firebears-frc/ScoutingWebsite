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
		<title>Error</title>
	</head>
	<body>
		{0} Error
	</body>
</html>
"""


def application(environ, start_response):
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
			return ["500 Internal Error".encode("UTF-8")]
	
	if surl == "data_api":
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
		elif os.path.exists(ppath+".html"):
			headers = [('Content-Type', "text/html")]
			with open(ppath+".html","rb") as f:
				data = f.read()
			start_response("200 OK", headers)
			return [data]

		print("ppath",ppath)

	print(surl,environ)
	start_response('404 Not Found', [('Content-Type', 'text/html')])
	fff = errorpage.format("404")
	return [fff.encode("UTF-8")]

