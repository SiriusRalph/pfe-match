"""Serve one PFE Match demo site on this computer, the way agent sites need it.

Usage:  python serve.py <folder> <port> <host>
  python serve.py pfe_match 8080 127.0.0.1
  python serve.py atlas_data 8081 localhost
  python serve.py nour_analytics 8082 ::1

It adds the header that lets other agent sites read this site's public files (CORS)
and tells the browser not to keep old copies, so you always see the latest version.
"""
import http.server
import socket
import sys
from functools import partial


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
                      ".woff2": "font/woff2", ".svg": "image/svg+xml"}

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()


class V6Server(http.server.ThreadingHTTPServer):
    address_family = socket.AF_INET6


def main():
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)
    folder, port, host = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    handler = partial(Handler, directory=folder)
    if host == "::1":
        server, shown = V6Server(("::1", port), handler), f"http://[::1]:{port}/"
    else:
        bind = "127.0.0.1" if host == "localhost" else host
        server, shown = http.server.ThreadingHTTPServer((bind, port), handler), f"http://{host}:{port}/"
    print(f"Serving {folder} — open {shown}  (Ctrl + C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
