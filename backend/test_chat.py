import requests
import json

url = "http://127.0.0.1:8000/chat"
payload = {"query": "What are the early signs of diabetes?"}

res = requests.post(url, json=payload)
print("Status Code:", res.status_code)
print("Response Text:\n", res.text)

try:
    data = res.json()
    print("\nAnswer:", data.get("answer"))
    print("Source:", data.get("source"))
except json.JSONDecodeError:
    print("Response was not valid JSON.")
