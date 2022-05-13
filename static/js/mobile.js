function toggle_spell(id) {
    container = document.getElementById(id)
    body = container.parentElement.children[2]
    bottom = container.parentElement.children[3]

    bottom.classList.toggle("spell_bottom_exp")

    if (container.getAttribute("collapsed") == "true") {
        container.setAttribute("collapsed", "false")
    } else {
        container.setAttribute("collapsed", "true")
    }
    container.classList.toggle("spell_head_shr")

    collapse(body)
}

function populateSpells(jsonResponse) {
    var data = JSON.parse(jsonResponse.srcElement.response)
    spells = document.getElementById("spellList")
    spells.innerHTML = ''
    spellCount = data.spellscount
    maxPages = Math.ceil(spellCount/spellsPerPage)
    data.spells.forEach(spell => {
        var spellBody = spellFormatBody(spell)
        var spellHigher = spellFormatHigher(spell.higher_level)

        spells.innerHTML +=`
<div id="${spell.spellid}">
    <div class="h20"></div>
    <div class="spell_head_container" id="${spell.spellid}_cr" onclick="toggle_spell(id)" collapsed="false">
        <p class="spell_head_text">${spell.name}</p>
        <p class="spell_head_text">Level ${spell.level}</p>
        <p class="spell_head_text overflow">${spell.classes[0] ? spell.subclasses ? spell.classes.sort().join(", ") + ", " + spell.subclasses.sort().join(", ") : spell.classes.sort().join(", ") : spell.subclasses.sort().join(", ")}</p>
    </div>
    <div class="spell_body" style="height: 0px" id="${spell.spellid+'_body'}" collapsed="true">
        <br>
        <p class="spellDispDescExp" style="margin-top: -4px;"><b>Level:</b> ${spell.level}</p>
        <p class="spellDispDescExp"><b>School:</b> ${spell.school}</p>
        <p class="spellDispDescExp"><b>Casting Time:</b> ${spell.cast_time}</p>
        <p class="spellDispDescExp"><b>Range:</b> ${spell.range}</p>
        <p class="spellDispDescExp"><b>Components:</b> ${spell.components.join(", ")} ${spell.material != "" ? '('+ spell.material + ')' : ''}</p>
        <p class="spellDispDescExp"><b>Duration:</b> ${spell.concentration == true ? "Concentration, " : ""} ${spell.duration}</p>
        <p class="spellDispDescExp">${spell.ritual == true ? "<b>Ritual:</b> Yes" : ""}</p>
        <p class="spellDispDescExp">${spell.classes[0] ? "<b>Classes:</b> " + spell.classes.sort().join(", ") : ""}</p>
        <p class="spellDispDescExp">${spell.subclasses ? "<b>Subclasses:</b> " + spell.subclasses.sort().join(", ") : ""}</p>
        ${spellBody}
        <p class="spellDispDescExp">${spellHigher}</p>
        <p class="spellDispDescExp">${spell.source.length > 2 ? "<b>Source:</b> " + spell.source : "<b>Sources:</b> " + spell.source.join(", ")}</p>
    </div>

    <div class="spell_bottom" onclick="toggle_spell(\'${spell.spellid + '_cr'}\')">
        <p class="spell_head_text">${spell.name}</p>
    </div>
</div>`
    })
}
