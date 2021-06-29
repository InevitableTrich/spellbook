from django.urls import re_path
from .viewclasses.baseviews import BaseView, SampleDataView, ReDir

urlpatterns = [
    re_path(r'samplejson$', SampleDataView.as_view()),
    re_path(r'redirect$', ReDir.as_view()),
    re_path(r'', BaseView.as_view()),
]

