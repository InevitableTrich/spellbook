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

        page = int(request.GET.get('pagenum'))
        field = request.GET.get('field')
        direction = request.GET.get('direction')
        searchquery = request.GET.get('searchquery')
        spellskwargs = {}

        spellnumsstart = (page-1)*50
        spellnumsend = (page*50)

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
            spells, spellscount = spellmgr.filter_spells(filterdata, spellnumsstart, spellnumsend, **spellskwargs)
            return HttpResponse(json.dumps({
                "spells": spells, "spellscount": spellscount
            }), content_type='application/json')

        spells, spellscount = spellmgr.search_filter_spells(filterdata, searchquery, spellnumsstart, spellnumsend, **spellskwargs)

        return HttpResponse(json.dumps({
                "spells": spells, "spellscount": spellscount
        }), content_type='application/json')


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
