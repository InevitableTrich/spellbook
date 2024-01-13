import json

from apps.home.viewclasses.spellview_impls import SpellsViewImpl

def get_spells_handler(event, context):
    responseobject = initalize_response()
    if event.get("httpMethod", "") == "OPTIONS":
        return responseobject

    body = event.get("body", "{}")

    responseobject["body"] = json.dumps(SpellsViewImpl().do_post(json.loads(body)))

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