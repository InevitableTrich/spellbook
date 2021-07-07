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
        spellskwargs = {}

        if field:
            sortField = field[0:-4]
            if sortField == 'class':
                sortField = 'classes'
            spellskwargs['sort'] = sortField

        if direction == '1':
            sortdir = pymongo.ASCENDING
            spellskwargs['sortby'] = sortdir
        elif direction == '2':
            sortdir = pymongo.DESCENDING
            spellskwargs['sortby'] = sortdir

        return HttpResponse(json.dumps({
            "spells": spellmgr.getspells(**spellskwargs)
        }), content_type='application/json')


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
