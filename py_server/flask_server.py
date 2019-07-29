from flask import Flask
import json
import requests
import json

app = Flask(__name__)

@app.route('/')
def hello_world():
    headerDict = {}
    paramDict = {}
    baseUrl = 'https' + '://' + 'api.yuuvis.io'

    json_data = {"query":{"maxItems":50,"statement":"SELECT * FROM enaio:object WHERE misc Like '#api%'","skipCount":0}}

    header_name = 'Content-Type'
    headerDict['Content-Type'] = 'application/json'
    header_name = 'Ocp-Apim-Subscription-Key'
    headerDict['Ocp-Apim-Subscription-Key'] = '60a6dbe666ec455ca4b636ef1cbd878d'

    session = requests.Session()

    #relative path to your new query file
    queryFilePath = '/path/to/your/query.json'
    response = session.post(str(baseUrl+'/dms/objects/search'), data=json_data, headers=headerDict)
    print(response.json())

    response = app.response_class(
        response=response.json() #json.dumps("{'hello': 'world'}"),
        status=200,
        mimetype='application/json'
    )
    return response
