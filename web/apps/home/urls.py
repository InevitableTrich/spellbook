from django.urls import re_path
from .viewclasses.baseviews import BaseView, ReDir, SortSpellsView

urlpatterns = [
    re_path(r'redirect$', ReDir.as_view()),
    re_path(r'sort', SortSpellsView.as_view()),
    re_path(r'', BaseView.as_view()),
]

