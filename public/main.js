// https://github.com/0xfe/vexflow/wiki/Tutorial
const VF = Vex.Flow;

const keyList = [
    {note: 'a', octave: [3, 5]},
    {note: 'b', octave: [3, 4]},
    {note: 'c', octave: [4, 5]},
    {note: 'd', octave: [4, 5]},
    {note: 'e', octave: [4, 5]},
    {note: 'f', octave: [4, 5]},
    {note: 'g', octave: [3, 5]}
]

let keyLines = [];

function randomNote(keyList) {
    const key = keyList[Math.floor(Math.random() * keyList.length)];
    const note = key.note;
    const octave = randomInteger(key.octave[0], key.octave[1] + 1);

    return `${note}/${octave}`;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomKeys() {
    return [randomNote(keyList)];
}

function intStave(context, x, y, width, initClef = false) {
    // Create a stave (staff) and add clef and time signature
    const stave = new VF.Stave(x, y, width);

    if (initClef) {
        stave.addClef("treble").addTimeSignature("4/4");
    }

    stave.setContext(context).draw();

    return stave
}

function createRender(width, height) {
    // Create an SVG renderer and attach it to the div
    const div = document.getElementById("music-canvas");
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    renderer.resize(width, height);

    return renderer;
}

function drawStave(context, keys, x, y, width, initClef = false, showAnnotation = false) {
    const stave = intStave(context, x, y, width, initClef);
    const notes = [];

    for (let i = 0; i < keys.length; i++) {
        const note = new VF.StaveNote({clef: "treble", keys: keys[i], duration: "q"});

        if (showAnnotation) {
            const text = mappingNotation(keys[i][0][0]);
            addAnnotation(text, note);
        }

        notes.push(note);
    }

    VF.Formatter.FormatAndDraw(context, stave, notes);

    return stave
}

function mappingNotation(note) {
    const sbxNotation = document.getElementById("sbxNotation").value;

    if (sbxNotation === "0") {
        return note;
    }

    switch (note) {
        case 'a':
            return 'La';
        case 'b':
            return 'Si';
        case 'c':
            return 'Do';
        case 'd':
            return 'Re';
        case 'e':
            return 'Mi';
        case 'f':
            return 'Fa';
        case 'g':
            return 'Sol';
    }
}

function addAnnotation(text, note) {
    const modifier = new VF.Annotation(text)
        .setFont("Arial", 20)
        .setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM);

    note.addModifier(modifier, 0);
}

function drawLine(keys, showAnnotation = false) {
    const renderer = createRender(2048, 200);
    const context = renderer.getContext();
    let stave = null;

    for (let i = 0; i < keys.length; i++) {
        if (stave) {
            stave = drawStave(context, keys[i], stave.width + stave.x, 40, 400, false, showAnnotation);
        } else {
            stave = drawStave(context, keys[i], 10, 40, 400, true, showAnnotation);
        }
    }
}

function randomAndDrawMusic(numberOfLine, numOfStave, showAnnotation) {
    let keyLines = randomKeyLineList(numberOfLine, numOfStave);

    drawMusic(keyLines, showAnnotation);

    return keyLines
}

function drawMusic(keyLines, showAnnotation = false) {
    for (let i = 0; i < keyLines.length; i++) {
        drawLine(keyLines[i], showAnnotation);
    }
}

function randomKeyLineList(numberOfLine, numOfStave) {
    return Array.from({length: numberOfLine}, () =>
        Array.from({length: numOfStave}, () =>
            Array.from({length: 4}, randomKeys)
        )
    );
}

function btnRefreshOnClick() {
    const numOfLine = document.getElementById("numOfLine").value;
    const numOfStave = document.getElementById("numOfStave").value;
    const cbxShowSymbols = document.getElementById("cbxShowSymbols");

    document.getElementById("music-canvas").innerHTML = "";

    keyLines = randomAndDrawMusic(numOfLine, numOfStave, cbxShowSymbols.checked);
}

function cbxShowSymbolsOnchange() {
    const cbxShowSymbols = document.getElementById("cbxShowSymbols");

    document.getElementById("music-canvas").innerHTML = "";

    drawMusic(keyLines, cbxShowSymbols.checked);
}

function sbxNotationOnchange() {
    cbxShowSymbolsOnchange();
}