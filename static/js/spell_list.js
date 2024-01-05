// list of all spells, sorted by internal id
var spell_list = [];

// spell class, contains spell data and helper functions for visual assembly of spells
class Spell {
    // takes a json element of the spell produced by the database, copies the data to a spell object
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

    // top of a spell
    static head_template = `
        <div class="spell" id="{0}">
            <div class="spell_head">
                <p class="spell_title name overflow">{1}</p>
                <p class="spell_title level">{2}</p>
                <p class="spell_title classes overflow">{3}</p>
                <div id="{0}_add" class="quick_add button" onclick="event.stopPropagation(); toggle_spell_in_book({0});">
                    <p class="spell_title quick_add">Quick Add</p>
                </div>
                <p class="spell_title spell_arrow arrow"><</p>
            </div>
            <div class="spell_head hidden">
                <p class="spell_title name" style="width: 94.5%">{1}</p>
                <p class="spell_title arrow"><</p>
            </div>
            <div class="toggle_button_top button" onclick="toggle_spell('{0}');"></div>
        </div>`
    ;

    // top of a spellbook spell
    static book_head_template = `
        <div class="spell{5}" id="{0}">
            <div class="spell_head">
                <p class="spell_title book_name overflow">{1}</p>
                <p class="spell_title concentration">{2}</p>
                <p class="spell_title ritual">{3}</p>
                <p class="spell_title cast_time">{4}</p>
                <div id="{0}_add" class="quick_add button" onclick="event.stopPropagation(); delete_from_spellbook({0});">
                    <p class="spell_title quick_add">Remove</p>
                </div>
                <p class="spell_title spell_arrow arrow"><</p>
            </div>
            <div class="spell_head hidden">
                <p class="spell_title name" style="width: 94.5%">{1}</p>
                <p class="spell_title arrow"><</p>
            </div>
            <div class="toggle_button_top button" onclick="toggle_spell('{0}');"></div>
        </div>`
    ;

    // contents of a spell, only visible once opened
    static body_template = `
        <div class="spell_top_spacer"></div>
        <p class="spell_text"><b>Level:</b> {0}</p>
        <p class="spell_text"><b>School:</b> {1}</p>
        <p class="spell_text"><b>Casting Time:</b> {2}</p>
        <p class="spell_text"><b>Range:</b> {3}</p>
        <p class="spell_text"><b>Components:</b> {4}</p>
        <p class="spell_text"><b>Duration:</b> {5}</p>
        {6}
        {7}
        {8}
        <p class="spell_text">{9}</p>
        <p class="spell_text">{10}</p>
        <p class="spell_text"><b>Sources:</b> {11}</p>
        <div class="spell_bottom_spacer"></div>
        <div class="row_container">
            <p class="spell_title name" style="width: 94.5%">{12}</p>
            <p class="spell_title spell_arrow arrow" style="transform: rotate(90deg);"><</p>
        </div>
        <div class="toggle_button_bottom button" onclick="toggle_spell({13});"></div>`
    ;

    // creates the head of the spell
    create_head() {
        const subs_and_classes = this.classes.slice().concat(this.subclasses).join(", ");

        return format_string(Spell.head_template, this.index, this.name, this.level, subs_and_classes);
    }

    // creates the head of a spellbook spell
    create_book_head(adjust_head) {
        const concentration = this.concentration ? "Concentration" : "Not Concentration";
        const ritual = this.ritual ? "Ritual" : "Not Ritual";

        if (adjust_head) {
            return format_string(Spell.book_head_template, this.index, this.name, concentration, ritual, this.cast_time,
            " book_spell");
        } else {
            return format_string(Spell.book_head_template, this.index, this.name, concentration, ritual, this.cast_time,
            "");
        }
    }

    // creates the body of the spell
    create_body() {
        // if there is a condition, add it to the cast_time
        var cast_time = this.cast_time;
        if (this.condition != "") {
            cast_time += ", " + this.condition;
        }

        // if there is a direction, add it to the range
        var range = this.range;
        if (this.direction != "") {
            range += " (" + this.direction + ")";
        }

        // if there is a royalty and/or material, add it to the end of the components
        var components = this.components.join(", ");
        if (this.royalty != "") {
            components += " (" + this.royalty + ")";
        }
        if (this.material != "") {
            components += " (" + this.material + ")"
        }

        // if concentration, prepend concentration indicator
        var duration = this.duration;
        if (this.concentration) {
            duration = "Concentration, up to " + duration;
        }

        // add ritual only if ritual, else leave blank
        var ritual = "";
        if (this.ritual) {
            ritual = '<p class="spell_text"><b>Ritual:</b> Yes</p>';
        }

        // if classes are present, add them (not present on certain chronurgy/graviturgy spells)
        var classes = "";
        if (this.classes.length != 0) {
            classes = format_string('<p class="spell_text"><b>Classes:</b> {0}</p>', this.classes.join(", "));
        }

        // if subclasses are present, add them
        var subclasses = "";
        if (this.subclasses.length != 0) {
            subclasses = format_string('<p class="spell_text"><b>Subclasses:</b> {0}</p>', this.subclasses.join(", "));
        }

        // if there are higher_level parts, add them
        var higher_levels = "";
        if (this.higher_level.length != 0) {
            higher_levels = format_string('<p class="spell_text"><b><i>At Higher Levels.</i></b> {0}</p>',
                                          this.higher_level.join("<br>&emsp;&emsp;"));
        }

        // add all sources. apostrophes were replaced with asterisks for sake of errors with quotes, put them back
        var sources = this.sources.join(", ").replaceAll("*", "'");

        // return the formatted body string
        return format_string(Spell.body_template, this.level, this.school, cast_time, range, components, duration,
                             ritual, classes, subclasses, this.make_description(), higher_levels, sources, this.name,
                             this.index);
    }

    // formats the description of the spell body
    make_description() {
        // collect each paragraph
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

    // creates a body with tables
    create_table(description) {
        // finds the final index of the table (starts search at end)
        var last_index;
        for (var i = description.length-1; i >= 0; i--) {
            if (description[i].indexOf("|") != -1) {
                last_index = i;
                break;
            }
        }

        var paragraph;
        var top = [];  // paragraphs before table
        var tables = [];  // table "paragraphs"
        var bottom = [];  // paragraphs after table
        var found_first = false; // false until first table "paragraph" found
        // for each paragraph,
        for (var i = 0; i < description.length; i++) {
            paragraph = description[i];

            // if there are no graph bars
            if (paragraph.indexOf("|") == -1) {
                // if the table hasn't started, place it in the top section
                if (!found_first) {
                    top.push(paragraph);
                } else {
                // else place in the bottom section
                    bottom.push(paragraph);
                }

                // no table, so move on
                continue;
            }

            // if this is the table header
            if (!found_first) {
                // uses <th> elements (table header). surrounds table data with table header elements
                paragraph = "<tr><th>" + paragraph.substr(1, paragraph.length-2) + "</th></tr>";
                paragraph = paragraph.replaceAll("|", "</th><th>");
            } else {
                // uses <td> elements (table data). surrounds table data with table data elements
                paragraph = "<tr><td>" + paragraph.substr(1, paragraph.length-2) + "</td></tr>";
                paragraph = paragraph.replaceAll("|", "</td><td>");
            }

            // if this is the first table "paragraph"
            if (!found_first) {
                // close previous text, add the table
                paragraph = '</p><table class="spell_table"><tbody>' + paragraph;
                found_first = true;
            } else if (i == last_index) {
            // if this is the final table "paragraph"
                // close the table, open new text
                paragraph += '</tbody></table><p class="spell_text">'
            }

            // add paragraph to tables
            tables.push(paragraph);
        }

        // place newlines and indentations between each paragraph before the table, add the table, then
        // place newlines and indentations between each paragraph after the table
        var body = top.join("<br>&emsp;&emsp;") + tables.join("") + bottom.join("<br>&emsp;&emsp;");

        return body;
    }
}

// toggles open/close given spell
function toggle_spell(id) {
    // get the spell element and children
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

// opens a given spell
function open_spell(id) {
    // get the spell element
    var spell_item = document.getElementById(id);

    // expand spell
    var section_height = spell_item.scrollHeight - 14;
    spell_item.classList.remove("spell_closed");
    spell_item.style.height = section_height + "px";

    // leave it unset to allow for screen changing width. waits 300ms which is transition time
    timeout_id = setTimeout(() => {
        spell_item.style.height = "unset";
        delete active_transitions[id];
    }, 300);

    // add the transition wait timer to a tracker. used for cancelling if closed before open completes
    active_transitions[id] = timeout_id;

    // rotate arrows
    spell_item.children[1].children[1].style = "transform: rotate(-90deg);";
    spell_item.children[0].children[4].style = "transform: rotate(-90deg);";
}

function close_spell(id) {
    // get the spell element
    var spell_item = document.getElementById(id);

    // remove current expanding animation if present
    if (Object.getOwnPropertyNames(active_transitions).indexOf(id) != -1) {
        clearTimeout(active_transitions[id]);
    }

    // get and save transition for later
    var transition = spell_item.style.transition;
    spell_item.style.transition = "";
    // set to current height for animation
    var sectionHeight = spell_item.scrollHeight - 14;
    spell_item.style.height = sectionHeight + "px";
    // put transition back
    spell_item.style.transition = transition;

    // rotate arrows and close. timeout for animation to render
    setTimeout(() => {
        spell_item.children[1].children[1].removeAttribute("style");
        spell_item.children[0].children[4].removeAttribute("style");

        spell_item.removeAttribute("style");
        spell_item.classList.add("spell_closed");
    }, 0);
}
