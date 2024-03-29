#!/usr/local/bin/python3
import os
import threading
import consolecommands
from datetime import date,datetime
import socket
import argparse
from http.server import BaseHTTPRequestHandler as RequestHandler
from http.server import HTTPServer
import json
from urllib.parse import urlparse, parse_qs

class WebHandler(RequestHandler):
	def do_HEAD(self):
		pass

	def do_POST(self):
		args = parse_qs(urlparse(self.path).query)
		clen = self.headers.get("Content-Length")
		filedata = self.rfile.read(int(clen))
		
		code = 500
		headers = [("Content-Type", "application/json")]
		data = json.dumps({"error":500}).encode("utf-8")


		if self.path.rstrip(".py") == "/data_api":
			import data_api as hdl
			if hdl:
				code, headers, data = hdl.simp_post(filedata,**args)
		

		##tprint(data)


		self.send_response(code)
		for i in headers:
			self.send_header(*i)
		self.end_headers()
		self.wfile.write(data)



	def do_GET(self):
		parsepath = urlparse(self.path)
		path = parsepath.path
		args = parse_qs(parsepath.query)

		"""
		if self.path.find("?") != -1 and len(self.path.split("?")) > 1:
			path,query = self.path.split("?")
			args = {i.split("=")[0]:i.split("=")[1] for i in query.split("&")}
		else:
			path = self.path
			query = ""
			args = {}
		"""

		hdl = None
		code = 200
		if path.rstrip(".py") == "/view":
			import view_page as hdl
		elif path == '/' or path.rstrip(".py") == "/scout":
			import scout_page as hdl
		elif path.rstrip(".py") == "/data_api":
			import data_api as hdl
		elif os.path.basename(path).endswith(".html"):
			headers = [("Content-Type", "text/html")]
			with open(os.path.basename(path),'rb') as f:
				data = f.read()
		elif os.path.basename(path).endswith(".js"):
			headers = [("Content-Type", "application/javascript")]
			with open(os.path.basename(path),'rb') as f:
				data = f.read()
		elif os.path.basename(path).endswith(".css"):
			headers = [("Content-Type", "text/css")]
			with open(os.path.basename(path),'rb') as f:
				data = f.read()
		else:
			import error_page as hdl

		if hdl:
			code, headers, data = hdl.simp_get(**args)

		self.send_response(code)
		for i in headers:
			self.send_header(*i)
		self.end_headers()
		self.wfile.write(data)

def tprint(txt):
	print("[" + datetime.now().strftime("%H:%M:%S") + "] " + txt)

def onServerStart(port):
	print("=================================")
	print("Started Server - " + date.today().strftime("%m/%d/%y") + " @ " + datetime.now().strftime("%H:%M:%S"))
	print("=================================")
	print("Server @ " + socket.gethostbyname(socket.gethostname()) + ":" + str(port))
	print("=================================")

cmds = {
	"clear" : consolecommands.clear,
	"ver" : consolecommands.ver,
	"showdata" : consolecommands.printData,
	"help" : consolecommands.printHelp,
}

doCmdThread = None
def doCommand():
	## console commands
	while True:
		cmd = input().lower()
		try:
			cmds[cmd]()
		except:
			tprint("error, not a valid command")
			pass
		



if __name__ == "__main__":
	par = argparse.ArgumentParser(description="Scouting Website LAN Server")
	par.add_argument("--port", "-p", type=int, nargs="?", help="port number", default=8080)
	args = par.parse_args()
	onServerStart(args.port)

	doCmdThread = threading.Thread(target=doCommand, args=())
	doCmdThread.daemon = True
	doCmdThread.start()

	serv = HTTPServer(("0.0.0.0", args.port), WebHandler)
	serv.serve_forever()