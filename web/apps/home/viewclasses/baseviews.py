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
            sortfield = field[0:-4]
            if sortfield == 'class':
                sortfield = 'classes'
            spellskwargs['sort'] = sortfield

        if direction == '1':
            sortdir = pymongo.ASCENDING
            spellskwargs['sortby'] = sortdir
        elif direction == '2':
            sortdir = pymongo.DESCENDING
            spellskwargs['sortby'] = sortdir

        return HttpResponse(json.dumps({
            "spells": spellmgr.getspells(**spellskwargs)
        }), content_type='application/json')


class FilterSpellsView(View):
    def post(self, request, *args, **kwargs):
        filterdata = json.loads(request.body).get("filter")

        field = request.GET.get('field')
        direction = request.GET.get('direction')
        spellskwargs = {}

        if field:
            sortfield = field[0:-4]
            if sortfield == 'class':
                sortfield = 'classes'
            spellskwargs['sort'] = sortfield

        if direction == '1':
            sortdir = pymongo.ASCENDING
            spellskwargs['sortby'] = sortdir
        elif direction == '2':
            sortdir = pymongo.DESCENDING
            spellskwargs['sortby'] = sortdir

        return HttpResponse(json.dumps({
            "spells": spellmgr.filter_spells(filterdata, **spellskwargs)
        }), content_type='application/json')


class SearchSpellsView(View):
    def get(self, request, *args, **kwargs):
        query = request.GET.get('query')

        if not query:
            return HttpResponse(json.dumps({
                "spells": spellmgr.getspells()
            }), content_type='application/json')

        return HttpResponse(json.dumps({
            "spells": spellmgr.searchspells(query)
        }), content_type='application/json')


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
