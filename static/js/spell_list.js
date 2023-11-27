var spell_list = [];

class Spell {
    constructor(spell_data) {
        this.name = spell_data["name"];
        this.level = spell_data["level"];
        this.school = spell_data["school"];
        this.cast_time = spell_data["cast_time"];
        this.condition = spell_data["condition"];
        this.range = spell_data["range"];
        this.direction = spell_data["direction"];
        this.components = spell_data["components"].slice();
        this.material = spell_data["material"];
        this.royalty = spell_data["royalty"];
        this.ritual = spell_data["ritual"];
        this.concentration = spell_data["concentration"];
        this.duration = spell_data["duration"];
        this.classes = spell_data["classes"].slice();
        this.classes.sort();
        this.subclasses = spell_data["subclasses"].slice();
        this.descriptions = spell_data["desc"].slice();
        this.higher_level = spell_data["higher_level"].slice();
        this.sources = spell_data["source"].slice();
        this.index = spell_data["spell_num"];

        // fix quotes on sources
        for (var i = 0, count = this.sources.length; i < count; i++) {
            this.sources[i] = this.sources[i].replaceAll("'", "*");
        }
    }

    static head_template = `
        <div class="spell" id="{0}">
            <div class="row_container" style="height: 1.5rem;">
                <p class="spell_title name overflow">{1}</p>
                <p class="spell_title level">{2}</p>
                <p class="spell_title classes overflow">{3}</p>
                <div class="quick_add button" onclick="event.stopPropagation(); alert('add');">
                    <p class="spell_title quick_add">Quick Add</p>
                </div>
                <p class="spell_title arrow"><</p>
            </div>
            <div class="row_container hidden" style="height: 1.5rem;">
                <p class="spell_title name" style="width: 94.5%">{1}</p>
                <p class="spell_title arrow"><</p>
            </div>
            <div class="toggle_button_top button" onclick="toggle_spell('{0}');"></div>
        </div>`
    ;

    static body_template = `
        <p class="spell_text"><b>Level:</b> {0}</p>
        <p class="spell_text"><b>School:</b> {1}</p>
        <p class="spell_text"><b>Casting Time:</b> {2}</p>
        <p class="spell_text"><b>Range:</b> {3}</p>
        <p class="spell_text"><b>Components:</b> {4}</p>
        <p class="spell_text"><b>Duration:</b> {5}</p>
        {6}
        <p class="spell_text"><b>Classes:</b> {7}</p>
        {8}
        <p class="spell_text">{9}</p>
        <p class="spell_text">{10}</p>
        <p class="spell_text"><b>Sources:</b> {11}</p>
        <div class="row_container">
            <p class="spell_title name" style="width: 94.5%">{12}</p>
            <p class="spell_title arrow" style="transform: rotate(90deg);"><</p>
        </div>
        <div class="toggle_button_bottom button" onclick="toggle_spell({13});"></div>`
    ;

    create_head() {
        var subs_and_classes = this.classes.slice().concat(this.subclasses).join(", ");

        return format_string(Spell.head_template, this.index, this.name, this.level, subs_and_classes);
    }

    create_body() {
        var cast_time = this.cast_time;
        if (this.condition != "") {
            cast_time += ", " + this.condition;
        }

        var range = this.range;
        if (this.direction != "") {
            range += " (" + this.direction + ")";
        }

        var components = this.components.join(", ");
        if (this.royalty != "") {
            components += " (" + this.royalty + ")";
        }
        if (this.material != "") {
            components += " (" + this.material + ")"
        }

        var duration = this.duration;
        if (this.concentration) {
            duration = "Concentration, up to " + duration;
        }

        var ritual = "";
        if (this.ritual) {
            ritual = '<p class="spell_text"><b>Ritual:</b> Yes</p>';
        }

        var classes = this.classes.join(", ");
        var subclasses = "";
        if (this.subclasses.length != 0) {
            subclasses = format_string('<p class="spell_text"><b>Subclasses:</b> {0}</p>', this.subclasses.join(", "));
        }

        var higher_levels = "";
        if (this.higher_level.length != 0) {
            higher_levels = format_string('<p class="spell_text"><b><i>At Higher Levels.</i></b> {0}</p>',
                                          this.higher_level.join("<br>&emsp;&emsp;"));
        }

        var sources = this.sources.join(", ").replaceAll("*", "'");

        return format_string(Spell.body_template, this.level, this.school, cast_time, range, components, duration,
                             ritual, classes, subclasses, this.make_description(), higher_levels, sources, this.name,
                             this.index);
    }

    make_description() {
        var description = this.descriptions.slice();
        var body;

        // check for tables
        if (description.join("").indexOf("|") != -1) {
            body = this.create_table(description);
        } else {
            body = description.join("<br>&emsp;&emsp;");
        }

        // check for table header
        while (body.indexOf("##### ") != -1) {
            var search = body.indexOf("##### ");

            body = body.replace("##### ", "<table_header>");

            var closing = body.indexOf("<br>", search + 1);
            body = body.substr(0, closing) + "</table_header>" + body.substr(closing);
        }

        // check for bold italics
        while (body.indexOf("***") != -1) {
            body = body.replace("***", "<b><i>");
            body = body.replace("***", "</b></i>");
        }

        return body;
    }

    create_table(description) {
        var last_index;
        for (var i = description.length-1; i >= 0; i--) {
            if (description[i].indexOf("|") != -1) {
                last_index = i;
                break;
            }
        }

        var paragraph;
        var top = [];
        var tables = [];
        var bottom = [];
        var found_first = false;
        for (var i = 0; i < description.length; i++) {
            paragraph = description[i];

            // if there are no graph bars
            if (paragraph.indexOf("|") == -1) {
                if (!found_first) {
                    top.push(paragraph);
                } else {
                    bottom.push(paragraph);
                }

                continue;
            }

            if (!found_first) {
                paragraph = "<tr><th>" + paragraph.substr(1, paragraph.length-2) + "</th></tr>";
                paragraph = paragraph.replaceAll("|", "</th><th>");
            } else {
                paragraph = "<tr><td>" + paragraph.substr(1, paragraph.length-2) + "</td></tr>";
                paragraph = paragraph.replaceAll("|", "</td><td>");
            }

            if (!found_first) {
                paragraph = '</p><table class="spell_table"><tbody>' + paragraph;
                found_first = true;
            } else if (i == last_index) {
                paragraph += '</tbody></table><p class="spell_text">'
            }

            tables.push(paragraph);
        }

        var body = top.join("<br>&emsp;&emsp;") + tables.join("") + bottom.join("<br>&emsp;&emsp;");

        return body;
    }
}

function toggle_spell(id) {
    var spell_item = document.getElementById(id);
    var spell_elements = spell_item.children;

    // add description if it doesn't have it
    if (!spell_item.hasAttribute("built")) {
        spell_item.innerHTML += spell_list[id].create_body();
    }

    // swap active headers
    spell_elements[0].classList.toggle("hidden");
    spell_elements[1].classList.toggle("hidden");

    // if the 'extended' header is visible, open. else close
    if (spell_elements[0].classList.contains("hidden")) {
        open_spell(id);

        // indicate that the description exists
        if (!spell_item.hasAttribute("built")) {
            spell_item.setAttribute("built", "");
        }
    } else {
        close_spell(id);
    }
}

function open_spell(id) {
    var spell_item = document.getElementById(id);

    // expand spell
    var section_height = spell_item.scrollHeight - 14;
    spell_item.style.height = section_height + "px";

    // rotate arrows
    spell_item.children[1].children[1].style = "transform: rotate(-90deg);";
    spell_item.children[0].children[4].style = "transform: rotate(-90deg);";
}

function close_spell(id) {
    var spell_item = document.getElementById(id);
    spell_item.removeAttribute("style");

    // rotate arrows. timeout for animation to render
    setTimeout(() => {
        spell_item.children[1].children[1].removeAttribute("style");
        spell_item.children[0].children[4].removeAttribute("style");
    }, 1);
}
