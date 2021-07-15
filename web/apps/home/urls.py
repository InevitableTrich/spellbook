from django.urls import re_path
from .viewclasses.baseviews import BaseView, ReDir, FilterSpellsView

urlpatterns = [
    re_path(r'redirect$', ReDir.as_view()),
    re_path(r'filter', FilterSpellsView.as_view()),
    re_path(r'', BaseView.as_view()),
]
