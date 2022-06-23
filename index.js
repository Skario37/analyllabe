function ButtonAnalyse () {
    const input = getInput();
    let syllables = getSyllables(input);
    syllables = syllables.map(v => v.trim())
    setResult(syllables.join(" "));
}


function getInput() {
    return document.getElementById("Input").value;
}

function setResult (result) {
    document.getElementById("Result").value = result;
}
