import json
from flask import Flask, request, jsonify
from uagents.query import query
from uagents import Model

app = Flask(__name__)

AGENT_ADDRESS = "agent1qgpagptgy525qxnl20383gphrf42wctpw5hg6h0lsajtte9w4zl2qgumtgv"

class Request(Model):
    file_path: str

def agent_query(req):
    # Synchronous call to agent
    response = query(destination=AGENT_ADDRESS, message=req, timeout=15.0)
    data = json.loads(response.decode_payload())
    command = data["text"]
    return command

@app.route("/")
def read_root():
    return "Hello from the Agent controller"

@app.route("/command", methods=["POST"])
def make_agent_call():
    try:
        req = {"file_path": "/Users/marvinzhai/Desktop/videos/threat.mp4"}
        res = agent_query(req)
        return jsonify(f"successful call - agent response: {res}")
    except Exception as e:
        return jsonify(f"unsuccessful agent call - {str(e)}"), 500

if __name__ == "__main__":
    app.run(debug=True)
