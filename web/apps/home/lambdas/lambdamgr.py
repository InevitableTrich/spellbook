import json

from apps.home.impls.spellviewimpl import FilterSpellsViewImpl


def filter_spells_handler(event, context):
    responseobject = initalize_response()
    if event['httpMethod'] == 'OPTIONS':
        return responseobject

    querystringparams = event['queryStringParameters']
    body = event.get('body', {})

    data = {key: val for key, val in querystringparams.items()}
    data.update(json.loads(body))

    responseobject['body'] = json.dumps(FilterSpellsViewImpl().do_post(data))

    return responseobject


def initalize_response():
    response = {
        'statusCode': 200,
        'isBase64Encoded': False,
        'headers': {}
    }
    response['headers']['Content-Type'] = 'application/content'
    response['headers']['Access-Control-Allow-Headers'] = 'Content-Type'
    response['headers']['Access-Control-Allow-Origin'] = '*'
    response['headers']['Access-Control-Allow-Methods'] = 'OPTIONS,POST,GET'
    return response