from flask import Flask, render_template
from flask import jsonify 
import glob
import datetime
import json
import requests
import re

app = Flask(__name__)

@app.template_filter()
def datetimefilter(value, format='%Y/%m/%d %H:%M'):
    """convert a datetime to a different format."""
    return value.strftime(format)

app.jinja_env.filters['datetimefilter'] = datetimefilter

@app.route("/")
def template_test():
    return "enter game id in the url"

@app.route('/<meta>', methods=['GET'])
def searchMeta(meta):
    
    print(meta)
    
    with app.open_resource('static/query.json') as f:
        search_lookup = json.load(f)
    
    
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
    res = session.post(str(baseUrl+'/dms/objects/search'), data=app.open_resource('static/query.json','rb'), headers=headerDict)
    
    
    res = res.json()
    #print(response.json())
    
    get_out = {}
    idx = 0
    prefix = "ten5d3a26a2f761b911a4240b9f"
    for obj in res['objects']:
        #print(obj['properties'][prefix+":question"]["value"])
        get_out["{0}".format(idx)] = obj['properties'][prefix+":question"]["value"].strip()
        idx+=1

    
    response = app.response_class(
        response=get_out, #res.json(), #json.dumps("{'hello': 'world'}"),
        status=200,
        mimetype='application/json'
    )
    
    
    #print(get_out)
    
    return jsonify(get_out)


"""
@app.route('/<gameid>', methods=['GET'])
def pbp(gameid):
    
    p_lookup = {}
    
    with app.open_resource('static/players.json') as f:
        p_lookup = json.load(f)
        
    pbp_url = "http://api.sports.yahoo.com:4080/v1/editorial/game/"
    pbp_suffix = "/plays?format=json"
    
    url = "".join([pbp_url, gameid, pbp_suffix])

    req = requests.get(url).content
    req_json = json.loads(req)
    
    results = []
    for play in req_json['game']['play_by_play']['plays']:
        
        play = play['play']
        if 'text' in play:

            description = play['text']

            ids = re.findall(r"\[.*?\]", description)

            # getting all the list of player ids from the description
            n_ids = [ id[1:-1] for id in ids]   

            for _id in n_ids:        
                description = description.replace("["+_id + "]", p_lookup[_id] if _id in p_lookup else _id )

            results.append(" - ".join([play['clock'],description]))

    return render_template('result.htm', res=results, title="Play-by-Play")
"""

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9999, debug=True)
