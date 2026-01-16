
import http.server, json, sys

class Handler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        try:
            payload = json.loads(body)
        except:
            payload = {"raw": body}
        # naive annotator: fabricate minimal fields so pipeline can be tested
        records = payload.get("records", [])
        enriched = []
        for rec in records:
            path = rec.get("path","")
            enriched.append({
                "path": path,
                "title": path.split("\\\\")[-1],
                "summary": "auto summary placeholder",
                "keywords": ["auto","placeholder"],
                "entities": [],
                "priority": 1,
                "fractal_path": "Fractal/Auto/Placeholder"
            })
        resp = {"records": enriched}
        data = json.dumps(resp).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type","application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

if __name__ == "__main__":
    port = 8765
    print(f"Stub AI webhook listening on http://127.0.0.1:{port}")
    http.server.HTTPServer(("127.0.0.1", port), Handler).serve_forever()
