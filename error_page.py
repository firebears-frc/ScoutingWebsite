

def handle_get(args, cookies, environ, start_response):
	pass
def handle_post(args, cookies, environ, start_response):
	pass


def simp_get(**query):
	fname = "error.html"
	ctype = "text/html"
	with open(fname,'rb') as f:
		html = f.read()

	error = query.get("error", 400)
	head = [("Content-Type", ctype)]
	return error, head, html	
