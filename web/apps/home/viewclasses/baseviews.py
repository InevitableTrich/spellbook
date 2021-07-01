from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import SimpleTemplateResponse
from django.views import View
import json


class BaseView(View):
    def get(self, request, *args, **kwargs):
        return SimpleTemplateResponse('index.html')


class SampleDataView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse(json.dumps({
	"spells": [{
			"id": "acid_arrow",
			"name": "Acid Arrow",
			"level": "2",
			"classes": "Fighter (Eldritch Knight), Rogue (Arcane Trickster), Wizard",
			"school": "Evocation",
			"cast_time": "1 action",
			"duration": "Instantaneous",
			"range": "90 feet",
			"components": "V, S, M",
			"material": "Powdered rhubarb leaf and an adder's stomach",
			"desc": "A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.",
			"higher_level": "When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd."

		},
		{
			"id": "booming_blade",
			"name": "Booming Blade",
			"level": "0",
			"classes": "Fighter (Eldritch Knight), Rogue (Arcane Trickster), Sorcerer, Warlock, Wizard",
			"school": "Evocation",
			"cast_time": "1 action",
			"duration": "1 round",
			"range": "Self (5-foot radius)",
			"components": "S, M",
			"material": "a melee weapon worth at least 1sp",
			"desc": "You brandish the weapon used in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects and then becomes sheathed in booming energy until the start of your next turn. If the target willingly moves 5 feet or more before then, the target takes 1d8 thunder damage, and the spell ends.",
			"higher_level": "This spell's damage increases when you reach certain levels. At 5th level, the melee attack deals 1d8 extra thunder damage to the target on a hit, and the damage the target takes for moving increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8)."
		}
	]
}), content_type='application/json')


class ReDir(View):
    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(redirect_to='/samples/samplejson')
