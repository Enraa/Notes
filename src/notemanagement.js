const { remote, app } = require('electron');
const { Menu } = remote;

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const notesdir = 'Notes'

// Buttons
const selectnotebutton = document.getElementById('selectnotebutton');

// Text Areas
const currentnotename = document.getElementById('currentnotename');
const textinput = document.getElementById('text-input');

const timeoutmilliseconds = 5000; // Save after this amount of time after typing. 
var savetimer;

selectnotebutton.onclick = getRecentNotes;

textinput.onchange = e => {
    try {
        clearTimeout(savetimer)
    }
    catch (err) { } // We don't care about the errors we generate if we're just now starting to type again
    savetimer = setTimeout(() => {
        var currenttext = document.getElementById('text-input').value;
        var notename = document.getElementById('currentnotename').innerText;
        console.log(notename);
        console.log(moment(notename,"MMM DD, YYYY"));
        console.log(currenttext);
        fs.writeFile(path.join(notesdir, moment(notename,"MMM DD, YYYY").format("YYYY-MM-DD") + ".txt"), currenttext, function (err) { if (err) console.log(err); })
    }, timeoutmilliseconds)
}

function getRecentNotes() {
    var inputSources = new Array();
    fs.readdir(notesdir, function (err, items) {
        console.log(items);
        if (err) console.log(err);
        items.forEach(function (el) {
            inputSources.push(el)
        })

        var menuoptions = inputSources.map(source => {
            return {
                label: source,
                click: () => selectNote(source)
            }
        })

        // If we have more notes than 10, let's cut it out to the latest 10 days. 
        if (menuoptions.length > 10) {
            menuoptions = menuoptions.slice(-10)
        }

        // Add the Browse button to open up the notes folder
        menuoptions.push({
            type: 'separator'
        }, {
            label: "Browse...",
            click: () => selectNote("browse")
        })

        // Generate the menu and pop it up
        var videoOptionsMenu = Menu.buildFromTemplate(menuoptions)
        videoOptionsMenu.popup();
    })
}

function selectNote(src) {
    if (src === "browse") {
        console.log(notesdir)
        console.log(path.join(notesdir,"Notes"))
        console.log(path.join(process.cwd(),"Notes"))
        remote.dialog.showOpenDialog({
            properties: ['openFile'],
            defaultPath: path.join(process.cwd(),"Notes")
        }).then((names) => {
            console.log("Done");
            console.log(names.filePaths);
            fs.readFile(names.filePaths[0], function (err, data) {
                if (err) console.log(err);
                else {
                    console.log(names.filePaths[0].slice(-14,-4))
                    document.getElementById("text-input").value = data;
                    document.getElementById("currentnotename").innerText = moment(names.filePaths[0].slice(-14,-4),"YYYY-MM-DD").format("MMM DD, YYYY")
                    console.log(data)
                }
            })
        });
    }
    else {
        fs.readFile(path.join(notesdir, src), function (err, data) {
            if (err) console.log(err);
            else {
                document.getElementById("text-input").value = data;
                document.getElementById("currentnotename").innerText = moment(src.slice(0,-4),"YYYY-MM-DD").format("MMM DD, YYYY")
                console.log(data)
            }
        })
    }
}