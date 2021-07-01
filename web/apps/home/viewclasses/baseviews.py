from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import SimpleTemplateResponse
from django.views import View
import json


class BaseView(View):
    def get(self, request, *args, **kwargs):
        return SimpleTemplateResponse('index.html')


class SampleDataView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse(json.dumps({'foo': {'bar': 0}}), content_type='application/json')


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
