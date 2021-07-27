import json


def lambda_handler(event, context):
    spellid = event['queryStringParameters']['spellid']

    print('spellID' + spellid)

    spellresponse = {}
    spellresponse['spellid'] = spellid

    responseobject = {}
    responseobject['statusCode'] = 200
    responseobject['headers'] = {}
    responseobject['headers']['Content-Type'] = 'application/json'
    responseobject['body'] = json.dumps(spellresponse)

    return responseobject
