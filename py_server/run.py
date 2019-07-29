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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9999, debug=True)
