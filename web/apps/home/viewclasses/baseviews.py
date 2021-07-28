import pymongo
from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import SimpleTemplateResponse
from django.views import View
import json

from ilt.managers import spellmgr


class FilterSpellsViewImpl(object):
    def do_post(self, data, *args, **kwargs):
        filterdata = data.get("filter", {})

        page = int(data.get('pagenum'))
        field = data.get('field')
        direction = data.get('direction')
        searchquery = data.get('searchquery')
        spellskwargs = {}

        spellnumsstart = (page - 1) * 50
        spellnumsend = (page * 50)

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
            return {"spells": spells, "spellscount": spellscount}

        spells, spellscount = spellmgr.search_filter_spells(filterdata, searchquery, spellnumsstart, spellnumsend,
                                                            **spellskwargs)
        return {"spells": spells, "spellscount": spellscount}
    

class _BaseView(View):
    def do_get(self, data, *args, **kwargs):
        raise NotImplementedError
    
    def do_post(self, data, *args, **kwargs):
        raise NotImplementedError
    
    def get(self, request, *args, **kwargs):
        if self.TEMPLATE:
            return SimpleTemplateResponse(self.TEMPLATE)
        data = {key: val for key, val in request.GET.items()}
        return HttpResponse(json.dumps(self.do_get(data, *args, **kwargs)), content_type='application/json')
    
    def post(self, request, *args, **kwargs):
        data = {key: val for key, val in request.GET.items()}
        data['body'] = request.body
        return HttpResponse(json.dumps(self.do_post(data, *args, **kwargs)), content_type='application/json')
    
    
class HomeView(_BaseView):
    TEMPLATE = 'index.html'


class FilterSpellsView(FilterSpellsViewImpl, _BaseView):
    pass


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
