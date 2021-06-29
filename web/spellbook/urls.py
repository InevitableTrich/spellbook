"""spellbook URL Configuration

The `urlpatterns` list routes URLs to viewclasses. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function viewclasses
    1. Add an import:  from my_app import viewclasses
    2. Add a URL to urlpatterns:  path('', viewclasses.home, name='home')
Class-based viewclasses
    1. Add an import:  from other_app.viewclasses import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import re_path, include

urlpatterns = [
    re_path(r'^$', include('apps.home.urls')),
    re_path(r'samples', include('apps.home.urls')),
]
