from django.urls import re_path
from .viewclasses.spellviews import HomeView, ReDir, FilterSpellsView, BookSpellsView

urlpatterns = [
    re_path(r'redirect$', ReDir.as_view()),
    re_path(r'filter', FilterSpellsView.as_view()),
    re_path(r'book-spells', BookSpellsView.as_view()),
    re_path(r'', HomeView.as_view()),
]
