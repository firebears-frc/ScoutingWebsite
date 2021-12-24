

def handle_get(args, cookies, environ, start_response):
	pass
def handle_post(args, cookies, environ, start_response):
	pass


def simp_get(**query):
	path = query.get("path")
	fname = "view.html"
	ctype = "text/html"
	if path == "view.js":
		ctype = "application/json"
		fname = "view.js"
	with open(fname,'rb') as f:
		html = f.read()

	resp = 200
	head = [("Content-Type", ctype)]
	return resp, head, html	




