const staticName = "Scouting"
const assets = [
	"/",
	"view.html",
	"view.js",
	"view.css",
]
self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(staticName).then(cache => {
			cache.add(assets);
		});
	)	
});
self.addEventListener("fetch", fetchEvent => {
	fetchEvent.respondWith(
		caches.match(fetchEvent.request).then(res => {
			return res || fetch(fetchEvent.request)
		});
	)
});
