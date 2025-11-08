import requests

url = "http://127.0.0.1:8000/health"
res = requests.get(url)
print("Status Code:", res.status_code)
print("Response JSON:", res.json())
    