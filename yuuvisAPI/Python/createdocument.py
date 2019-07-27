import requests
import json
YUUVIS_SUBKEY = '60a6dbe666ec455ca4b636ef1cbd878d'
header_dict = {}
param_dict = {}
base_url = "https://api.yuuvis.io/dms/objects" #"https://" + "api.yuuvis.io"
#header_name = 'Content-Type'
#header_dict[header_name] = 'multipart/form-data, application/x-www-form-urlencoded'
header_name = 'Ocp-Apim-Subscription-Key'
header_dict[header_name] = YUUVIS_SUBKEY
session = requests.Session()
session.max_redirects = 0
binary_file = "aoe.jpg"
metadata_file = "metadata.json"
multipart_form_data = {
    'data' :('metadata.json', open(metadata_file, 'r'), 'application/json'),
    'cid_63apple' : ('aoe.jpg', open(binary_file, 'rb'), "image/jpeg")
}
response = session.post(base_url, files=multipart_form_data, headers=header_dict)
print(response.url)
print(response.is_permanent_redirect)
print(response.json())

Message #co-pilot


