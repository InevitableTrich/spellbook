import json

from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import SimpleTemplateResponse
from django.views import View

from apps.home.impls.spellviewimpl import FilterSpellsViewImpl


class _BaseView(View):
    def do_get(self, data, *args, **kwargs):
        raise NotImplementedError

    def do_post(self, data, *args, **kwargs):
        raise NotImplementedError

    def get(self, request, *args, **kwargs):
        if self.TEMPLATE:
            return SimpleTemplateResponse(self.TEMPLATE)
        data = {key: val for key, val in request.GET.items()}
        return HttpResponse(json.dumps(self.do_get(data, *args, **kwargs)), content_type='application/content')

    def post(self, request, *args, **kwargs):
        data = {key: val for key, val in request.GET.items()}
        data['body'] = request.body
        return HttpResponse(json.dumps(self.do_post(data, *args, **kwargs)), content_type='application/content')


class HomeView(_BaseView):
    TEMPLATE = 'index.html'


class FilterSpellsView(FilterSpellsViewImpl, _BaseView):
    pass


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
