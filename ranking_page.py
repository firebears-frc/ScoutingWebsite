def simp_get(**query):
	path = query.get("path")
	fname = "ranking.html"
	ctype = "text/html"
	with open(fname,'rb') as f:
		html = f.read()

	resp = 200
	head = [("Content-Type", ctype)]
	return resp, head, html	




