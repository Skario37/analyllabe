function ButtonAnalyse () {
    const input = getInput();
    let syllables = getSyllables(input);
    syllables = syllables.map(v => v.trim())
    setResult(syllables.join(" "));
    setNbSyllables(syllables.length);
}


function getInput() {
    return document.getElementById("Input").value;
}

function setResult (result) {
    document.getElementById("Result").value = result;
}

function setNbSyllables (nb) {
    const elem = document.getElementById("NbSyllables");
    elem.innerText = `Nombre: ${nb}`;
    elem.classList.remove("hide");
}