import json


def lambda_handler(event, context):
    field = event['queryStringParameters']['field']
    page = int(event['queryStringParameters']['pagenum'])
    direction = event['queryStringParameters']['direction']
    searchquery = event['queryStringParameters']['searchquery']

    # filterdata = event['body'].get("filter")

    spellresponse = {}
    spellresponse['page'] = page
    spellresponse['field'] = field
    spellresponse['direction'] = direction
    spellresponse['searchquery'] = searchquery
    # spellresponse['filterdata'] = filterdata

    responseobject = {}
    responseobject['statusCode'] = 200
    responseobject['headers'] = {}
    responseobject['headers']['Content-Type'] = 'application/content'
    responseobject['body'] = json.dumps(spellresponse)

    return responseobject
