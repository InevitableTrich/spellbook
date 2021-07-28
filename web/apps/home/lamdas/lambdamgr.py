from apps.home.viewclasses.baseviews import FilterSpellsViewImpl
import json


def filter_spells_handler(event, context):
    querystringparams = event['queryStringParameters']
    body = event.get('body', {})

    data = {key: val for key, val in querystringparams.items()}
    data.update(json.loads(body))

    responseobject = {}
    responseobject['statusCode'] = 200
    responseobject['headers'] = {}
    responseobject['headers']['Content-Type'] = 'application/json'
    responseobject['body'] = FilterSpellsViewImpl().do_post(data)

    return responseobject
