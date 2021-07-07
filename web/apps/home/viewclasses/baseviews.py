import pymongo
from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import SimpleTemplateResponse
from django.views import View
import json

from ilt.managers import spellmgr


class BaseView(View):
    def get(self, request, *args, **kwargs):
        return SimpleTemplateResponse('index.html')


class SortSpellsView(View):
    def get(self, request, *args, **kwargs):

        field = request.GET.get('field')
        direction = request.GET.get('direction')
        sortField = None
        sortdir= None

        if field:
            sortField = field[0:-4]
            if sortField == 'class':
                sortField = 'classes'

        if direction == '1':
            sortdir = pymongo.ASCENDING
        elif direction == '2':
            sortdir = pymongo.DESCENDING

        return HttpResponse(json.dumps({
            "spells": spellmgr.getspells(sort=sortField, sortby=sortdir)
        }), content_type='application/json')


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
