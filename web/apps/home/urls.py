from django.urls import re_path
from .viewclasses.spellviews import HomeView, ReDir, BookSpellsView, MobileView, SpellsView

urlpatterns = [
    re_path(r'redirect$', ReDir.as_view()),
    re_path(r'book-spells', BookSpellsView.as_view()),
    re_path(r'spells', SpellsView.as_view()),
    re_path(r'mobile', MobileView.as_view()),
    re_path(r'', HomeView.as_view()),
]
