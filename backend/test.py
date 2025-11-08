import requests

url = "http://127.0.0.1:8000/chat"
res = requests.post(url, json={"query": "What are the early signs of diabetes?"})
print(res.status_code)
print(res.text)
