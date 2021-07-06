def getspells():
    return [{
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
        "higher_level": "When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd. "
    }, {
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
        "higher_level": "This spell's damage increases when you reach certain levels. At 5th level, the melee attack deals 1d8 extra thunder damage to the target on a hit, and the damage the target takes for moving increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8). "
    }, {
        "id": "fireball",
        "name": "Fireball",
        "level": "3",
        "classes": "Fighter (Eldritch Knight), Rogue (Arcane Trickster), Sorcerer, Wizard",
        "school": "Evocation",
        "cast_time": "1 action",
        "duration": "Instantaneous",
        "range": "150 feet",
        "components": "V, S, M",
        "material": "a tiny ball of bat guano",
        "desc": "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one. The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.",
        "higher_level": "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd. "
    }, {
        "id": "counterspell",
        "name": "Counterspell",
        "level": "3",
        "classes": "Fighter (Eldritch Knight), Rogue (Arcane Trickster), Sorcerer, Warlock, Wizard",
        "school": "Abjuration",
        "cast_time": "1 reaction, which you take when you see a creature within 60 feet of you casting a spell",
        "duration": "Instantaneous",
        "range": "60 feet",
        "components": "S",
        "material": "",
        "desc": "You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect.",
        "higher_level": "When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used. "
    }]
