import json
import pymongo
from gql.transport.aiohttp import AIOHTTPTransport
from ilt.managers import spellmgr


def lambda_handler(event, context):
    print(len(spellmgr.getspells()))

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
    responseobject['headers']['Content-Type'] = 'application/json'
    responseobject['body'] = json.dumps(spellresponse)

    return responseobject
