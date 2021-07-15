import pymongo
from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import SimpleTemplateResponse
from django.views import View
import json

from ilt.managers import spellmgr


class BaseView(View):
    def get(self, request, *args, **kwargs):
        return SimpleTemplateResponse('index.html')


class FilterSpellsView(View):
    def post(self, request, *args, **kwargs):
        filterdata = json.loads(request.body).get("filter")

        field = request.GET.get('field')
        direction = request.GET.get('direction')
        searchquery = request.GET.get('searchquery')
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
        if searchquery == '':
            return HttpResponse(json.dumps({
                "spells": spellmgr.filter_spells(filterdata, **spellskwargs)
            }), content_type='application/json')

        return HttpResponse(json.dumps({
            "spells": spellmgr.search_filter_spells(filterdata, searchquery, **spellskwargs)
        }), content_type='application/json')


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
