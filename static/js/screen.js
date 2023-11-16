var open_screens = []

document.addEventListener('keydown', function(event) {
    if (document.activeElement.nodeName == 'INPUT') {
        return;
    }

    switch (event.key) {
        case 'Escape':
            close_all_screens();
            break;
    }
});

function toggle_screen(id) {
    if (document.getElementById(id).classList.contains('hidden')) {
        open_screen(id);
    } else {
        close_screen(id);
    }
}

function open_screen(id) {
    var screen = document.getElementById(id);
    screen.classList.remove('hidden');

    open_screens.push(id);
}

function close_screen(id) {
    var screen = document.getElementById(id);
    if (!screen.classList.contains('hidden')) {
        screen.classList.add('hidden');
    }

    var ndx = open_screens.indexOf(id);
    open_screens.splice(ndx, 1);
}

function close_all_screens() {
    var open_screens_count = open_screens.length;
    var i = 0;

    while (i < open_screens_count) {
        close_screen(open_screens[i]);

        i++;
    }
}