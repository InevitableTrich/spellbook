import json
import re
from phb24_data.phb24_html import A_SPELLS


def clean_string(s: str):
    # remove any unicode characters
    s = (s.replace("\u2019", "'")
         .replace("\u201c", "\"")
         .replace("\u201d", "\"")
         .replace("\u2013", "-")
         .replace("\u2014", "-")
         .replace("\u2212", "-")
         .replace("\u00d7", "*")
         .replace("’", "'")
         .replace("  ", " "))

    return s


def get_name(line: str):
    final_a = line.rfind("<a")
    start_name = line.find(">", final_a) + 1
    end_name = line.find("<", start_name)
    return clean_string(line[start_name:end_name])


def parse_header(line: str):
    start = line.find("<em>") + 4
    end = line.find("</em>", start)

    text = line[start:end]
    class_start = text.find("(") + 1
    class_end = text.rfind(")")
    class_text = text[class_start:class_end]
    text = text[:class_start - 2]

    header = {"classes": class_text.split(", ")}
    components = text.split(" ")
    # if the first component is Level, its a levelled spell
    if components[0] == "Level":
        header["level"] = components[1]
        header["school"] = components[2]
    else:  # otherwise, its a cantrip
        header["level"] = "0"
        header["school"] = components[0]

    return header


def get_cast_time(line: str, regexes: dict[str: re.Pattern]):
    start = line.rfind("</strong>") + 10
    end = line.rfind("</p>")
    cast_time = replace_elements(line[start:end], regexes)

    ritual = cast_time.find(" or Ritual")
    if ritual != -1:
        return cast_time[:ritual], True

    return cast_time, False


def get_range(line: str):
    start = line.rfind("</strong>") + 10
    end = line.rfind("</p>")
    return line[start:end]


def get_components(line: str):
    start = line.rfind("</strong>") + 10
    end = line.rfind("</p>")
    components = line[start:end]

    material = components.find("(")
    if material != -1:
        letters = components[:material - 1].split(", ")
        mat = clean_string(components[material + 1:-1])
        return letters, mat
    return components.split(", "), ""


def get_duration(line: str):
    start = line.rfind("</strong>") + 10

    concentration = False
    # if the next character is an open angle bracket, its a link to concentration
    if line[start] == "<":
        concentration = True
        start = line.rfind("</a>") + 6

    end = line.rfind("</p>")

    return line[start:end], concentration


def check_desc_line(line: str):
    # ignore misc closing tags
    if line == "</ul>" or line == "</div>":
        return 1

    # once a stat block starts, no more description
    if line.find("class=\"stat-block\"") != -1:
        return 2

    # don't worry about list start
    if line.find("<ul data-") != -1:
        return 1

    # ignore 'hanging indent'
    if line.find("class=\"hangingIndent\"") != -1:
        return 1

    # if a line item, work as normal
    if line[:3] == "<li":
        return 0

    # if text is continuing on another line, continue old desc
    if line[:2] != "<p":
        return 3

    # if a separator is on this line, process as normal, then end desc
    if line.rfind("<hr class=\"separator\">") != -1:
        return 4

    return 0


def process_desc_line(line: str, regexes: dict[str: re.Pattern]):
    desc_line_start = line.find(">") + 1
    desc_line_end = line.rfind("</")
    desc = line[desc_line_start:desc_line_end]

    # if the end is not found, take until the end
    if desc_line_end == -1:
        desc = line[desc_line_start:]

    # process any extraneous elements
    desc = replace_elements(desc, regexes)

    # if line is a list item
    if line.find("<li") != -1:
        desc = f"- {desc[:-4]}"

    # remove any unicode characters
    desc = clean_string(desc)

    return desc


def replace_elements(content: str, regexes: dict[str:re.Pattern]):
    # any time a match occurs, process it, then go to the next one
    regex = regexes["element"]
    tooltip = regexes["tooltip"]
    match = regex.search(content)
    while match:
        if match.group("tag") == "a":
            classes = match.group("class")
            content = match.group("pre") + match.group("mid") + match.group("post")

            if classes is None:
                content = match.group("pre") + match.group("mid") + match.group("post")
            else:
                tooltip_match = tooltip.search(classes)
                if tooltip_match:
                    content = f"{match.group('pre')}&{tooltip_match.group(1)}&[{match.group('mid')}]{match.group('post')}"
                else:
                    print(classes)

        elif match.group("tag") == "strong":
            content = f"{match.group('pre')}**{match.group('mid')}**{match.group('post')}"
        elif match.group("tag") == "em":
            if match.group('mid').startswith(" "):
                content = f"{match.group('pre')} *{match.group('mid')[1:]}*{match.group('post')}"
            else:
                content = f"{match.group('pre')}*{match.group('mid')}*{match.group('post')}"

        match = regex.search(content)

    # check for unmatched elements
    regex = regexes["unmatched_element"]
    match = regex.search(content)
    while match:
        span = match.span()
        content = content[:span[0]] + content[span[1]:]

        match = regex.search(content)

    return content


def lines_to_data(lines: list[str]):
    started = False
    regexes = {
        "letter_header": re.compile(r'^<h2'),
        "start_spell": re.compile(r'^<h3'),
        "end_spell": re.compile(r'^(<hr class="separator">)|(<!-- #endregion -->)$'),
        "element": re.compile(
            r'(?P<pre>.*)<(?P<tag>[a-z]+) ?(?:class="(?P<class>.*-tooltip)")?.*>(?P<mid>.*)</(?P=tag)>(?P<post>.*)'),
        "tooltip": re.compile(r'.*(rule|action|condition|spell|monster|sense|skill|item)-tooltip'),
        "unmatched_element": re.compile(r'<.*>'),
        "table_header": re.compile(r'.*</a>(.*)</h4>'),
        "table_data": re.compile(r'<(?P<tag>tr|th|td)>(?:(?P<data>.*)</(?P=tag)>)?')
    }
    spells = []
    spell_count = 0
    total_lines = len(lines)

    # check each line
    for i in range(total_lines):
        line = lines[i]

        # if the start of the spells hasn't been found yet, skip
        if not started:
            # this comment is the start of the spells
            if line == "<!-- #region -->":
                started = True
            continue

        # if the line is a h2, its a letter header: ignore
        if regexes["letter_header"].search(line) is not None:
            continue

        # remove any unicode characters
        line = clean_string(line)

        # if the line is an h3, its the start of a spell
        if regexes["start_spell"].search(line) is not None:
            # Name
            spells.append({
                "higher_level": [],
                "source": ["Player's Handbook 2024"],
            })
            spells[spell_count]["name"] = get_name(line)

            # Classes, Level, School
            i += 1
            header = parse_header(lines[i])
            spells[spell_count].update(header)

            # Cast Time, Ritual
            i += 2
            cast_time = get_cast_time(lines[i], regexes)
            spells[spell_count]["cast_time"] = cast_time[0]
            spells[spell_count]["ritual"] = cast_time[1]

            # Range
            i += 1
            spells[spell_count]["range"] = get_range(lines[i])

            # Components
            i += 1
            components = get_components(lines[i])
            spells[spell_count]["components"] = components[0]
            spells[spell_count]["material"] = components[1]

            # Duration
            i += 1
            duration = get_duration(lines[i])
            spells[spell_count]["duration"] = duration[0]
            spells[spell_count]["concentration"] = duration[1]

            # Descriptions
            i += 2
            line = lines[i]
            description = []
            while line != "" and regexes["end_spell"].search(line) is None:
                # if a table is found, process the table
                if line.find("class=\"table-overflow-wrapper\"") != -1:
                    i += 1
                    line = lines[i]

                    # until the end of the table is found,
                    while line != "</table></div>":
                        # clean the line
                        line = clean_string(line)

                        # if a table heading has been found, add the heading
                        match = regexes["table_header"].search(line)
                        if match:
                            description.append(f"##### {match.group(1)}")
                            i += 1
                            line = lines[i]
                            continue

                        # check for table data
                        match = regexes["table_data"].search(line)
                        if match:
                            tag, data = match.group("tag"), match.group("data")
                            if tag == "tr":
                                description.append("|")
                            elif tag == "th" or tag == "td":
                                data = replace_elements(data, regexes)
                                description[-1] += f"{data}|"

                        i += 1
                        line = lines[i]

                    i += 1
                    line = lines[i]
                    continue

                valid = check_desc_line(line)
                if valid == 3:
                    line = clean_string(replace_elements(line, regexes))
                    description[-1] += f" {line}"
                if valid == 1 or valid == 3:
                    i += 1
                    line = lines[i]
                    continue
                elif valid == 2:
                    break

                description.append(process_desc_line(line, regexes))

                if valid == 4:
                    break

                i += 1
                line = lines[i]
            spells[spell_count]["desc"] = description

            spell_count += 1

    return spells


def scrape():
    lines = A_SPELLS.split("\n")[1:-1]
    spells = lines_to_data(lines)
    with open("../phb24.json", "w") as fp:
        json.dump(spells, fp)  # cmd+opt+L to fmt json
    print()


if __name__ == '__main__':
    scrape()
