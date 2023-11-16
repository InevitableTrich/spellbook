import json

from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import SimpleTemplateResponse
from django.views import View

from apps.home.impls.spellviewimpl import BookSpellsViewImpl, SpellsViewImpl


class _BaseView(View):
    def do_get(self, data, *args, **kwargs):
        raise NotImplementedError

    def do_post(self, data, *args, **kwargs):
        raise NotImplementedError

    def get(self, request, *args, **kwargs):
        try:
            if self.TEMPLATE:
                return SimpleTemplateResponse(self.TEMPLATE)
        except:
            data = {key: val for key, val in request.GET.items()}
            return HttpResponse(json.dumps(self.do_get(data, *args, **kwargs)), content_type='application/content')

    def post(self, request, *args, **kwargs):
        data = {key: val for key, val in request.GET.items()}
        data['body'] = request.body
        return HttpResponse(json.dumps(self.do_post(data, *args, **kwargs)), content_type='application/content')


class HomeView(_BaseView):
    TEMPLATE = 'index.html'


class MobileView(_BaseView):
    TEMPLATE = 'mobile.html'


class BookSpellsView(BookSpellsViewImpl, _BaseView):
    pass

class SpellsView(SpellsViewImpl, _BaseView):
    pass


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
