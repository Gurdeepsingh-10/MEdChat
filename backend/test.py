import requests

url = "http://127.0.0.1:8000/chat"
payload = {"query": "What are the early signs of diabetes?"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)

print("Status Code:", response.status_code)
print("Raw Response Text:\n", response.text)
