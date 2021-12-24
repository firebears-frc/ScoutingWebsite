

def handle_get(args, cookies, environ, start_response):
	pass
def handle_post(args, cookies, environ, start_response):
	pass


def simp_get(**query):
	path = query.get("path")
	fname = "scout.html"
	ctype = "text/html"
	if path == "scout.js":
		ctype = "application/json"
		fname = "scout.js"
	with open(fname,'rb') as f:
		html = f.read()

	resp = 200
	head = [("Content-Type", ctype)]
	return resp, head, html	




