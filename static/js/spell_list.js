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
                <div id="{0}_quick_add" class="quick add button" onclick="event.stopPropagation(); toggle_spell_in_book({0});">
                    <p class="spell_title quick_add">Quick Add</p>
                </div>
                <div></div>
                <p class="spell_title spell_arrow arrow"><</p>
            </div>
            <div class="spell_head hidden">
                <p class="spell_title open_name">{1}</p>
                <div id="{0}_add" class="full add button" onclick="event.stopPropagation(); toggle_spell_in_book({0});">
                    <p class="spell_title add">Add To Spellbook</p>
                </div>
                <p class="spell_title spell_arrow arrow"><</p>
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
                <div id="{0}_quick_add" class="quick add button short_add"
                    onclick="event.stopPropagation(); delete_from_spellbook({0});">
                    <p class="spell_title quick_add">Remove</p>
                </div>
                <p class="spell_title spell_arrow arrow"><</p>
            </div>
            <div class="spell_head hidden">
                <p class="spell_title open_name">{1}</p>
                <div id="{0}_add" class="full add button" onclick="event.stopPropagation(); delete_from_spellbook({0});">
                    <p class="spell_title add">Remove From Spellbook</p>
                </div>
                <p class="spell_title spell_arrow arrow"><</p>
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
            <p class="spell_title name" style="width: calc(100% - 2rem - .5%">{12}</p>
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

        // adjust head for cantrips
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
        const sources = this.sources.join(", ").replaceAll("*", "'");

        // return the formatted body string
        return format_string(Spell.body_template, this.level, this.school, cast_time, range, components, duration,
                             ritual, classes, subclasses, this.make_description(), higher_levels, sources, this.name,
                             this.index);
    }

    // formats the description of the spell body
    make_description() {
        // collect each paragraph
        const description = this.descriptions.slice();
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

            var closing = body.indexOf("</p>", search + 1);
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
        // finds the indexes of table lines
        var table_count = 0;
        var last_was_table = false;
        var table_poses = [];
        var bodies = [[]];
        var tables = [];
        var desc;
        for (var i = 0; i < description.length; i++) {
            desc = description[i];

            // if there is table content,
            if (desc.indexOf("|") != -1) {
                // and the last line wasn't table content,
                if (!last_was_table) {
                    // increase count, add to lists, and track table position
                    last_was_table = true;
                    table_count++;
                    bodies.push([]);
                    tables.push([]);
                    table_poses.push([i, i]);
                } else { // if the last line was table content, update the end pos
                    table_poses[table_count-1][1] = i;
                }
            } else { // otherwise, the last was not table content
                last_was_table = false;
            }
        }

        var index = 0;
        var start, end;
        for (var i = 0; i < table_poses.length; i++) {
            // get the start and end position of this table
            start = table_poses[i][0];
            end = table_poses[i][1];

            // grab all the non-table content up until this point
            while (index < start) {
                bodies[i].push(description[index]);
                index++;
            }

            // build this table
            while (index <= end) {
                desc = description[index];

                // if the index is the start,
                if (index == start) {
                    // create a new table, close old text, start the body, create the head row
                    tables[i].push("</p><table class=\"spell_table\"><tbody><tr><th>");
                    // take the table data, remove the ends, and change pipes to row separators
                    tables[i].push(desc.slice(1, -1).replaceAll("|", "</th><th>"));
                    // close the row
                    tables[i].push("</th></tr>");
                } else { // for the rest of the rows, just make each row
                    tables[i].push("<tr><td>");
                    // take the table data, remove the ends, and change pipes to row separators
                    tables[i].push(desc.slice(1, -1).replaceAll("|", "</td><td>"));
                    tables[i].push("</td></tr>");
                }

                // if this is the last row for this table, close the table, start next text
                if (index == end) {
                    tables[i].push("</tbody></table><p class=\"spell_text\">");
                }

                index++;
            }
        }

        // add the final body lines
        while (index < description.length) {
            bodies[table_count].push(description[index]);
            
            index++;
        }

        // finally, combine the bodies and the tables
        var body = "";
        for (var i = 0; i < table_count; i++) {
            body += bodies[i].join("<br>&emsp;&emsp;") + tables[i].join("") + "&emsp;&emsp;";
        }
        body += bodies[table_count].join("<br>&emsp;&emsp;");
        
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
        spell_item.setAttribute("built", "");
    }

    // swap active headers
    spell_elements[0].classList.toggle("hidden");
    spell_elements[1].classList.toggle("hidden");

    // close if it is open, else open
    if (spell_item.hasAttribute("open")) {
        close_collapsable(id, "2.5rem");

        // rotate arrows and close. timeout for animation to render
        setTimeout(() => {
            spell_elements[1].children[2].removeAttribute("style");
            spell_elements[0].children[5].removeAttribute("style");

            spell_item.removeAttribute("style");
        }, 0);
    } else {
        var offset = 16;
        if (is_mobile()) {
            offset = 32;
        }
        open_collapsable(id, offset);

        // rotate arrows
        spell_elements[1].children[2].style = "transform: rotate(-90deg);";
        spell_elements[0].children[5].style = "transform: rotate(-90deg);";
    }
}