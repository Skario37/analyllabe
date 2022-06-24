const VOWELS = {
    fr: new RegExp(/^[aeiouy]$/i)
}


// GOT
// On ne sépare jamais les groupes de consonnes « ch« , « ph« , « th« , « gn »
// Si la fin d'un mot se termine que par des consonnes il n'y a pas de coupure
// Lorsque deux consonnes se suivent, la césure s’effectue entre les deux, ce qui est toujours le cas dès lors qu’elles sont doublées.
// Lorsque trois consonnes se suivent la coupure doit s’effectuer après la deuxième sauf si on a deux consonnes identiques.
// La règle générale est de séparer les syllabes entre une voyelle et une consonne.
// Si les lettres « l » et « r » sont accolées à la deuxième consonne, la coupure doit se faire après la première consonne.

function computefr(str) {
    const array = [];
    // RULE N°1
    // On ne sépare jamais les groupes de consonnes « ch » , « ph » , « th » , « gn »
    const rule1 = ["ch", "ph", "th", "gn", "zr", "zl", "tr", "tl", "pr", "pl", "dl", "dr", "fr", "fl", "gr", "gl", "kl", "kr", "cr", "cl", "jr", "jl", "qr", "ql", "br", "bl", "vr", "vl"];
    for (let i = 0; i < str.length; i++) {
        if (i < str.length - 1) {
            if (rule1.includes(array[i-1] + str[i])) {
                array[i-1] += str[i];
            } else {
                array.push(str[i]);
            }
        } else {
            array.push(str[i]);
        }
    }
    // END OF RULE N°1

    for (let i = 0; i < array.length; i++) {
        // RULE N°2
        // Si la fin d'un mot se termine que par des consonnes il n'y a pas de coupure
        if ((array.slice(i)).every(v => !isVowel(v, 'fr'))) {
            const delArray = array.splice(i, array.length-1);
            array.push(delArray.join(""));
        }
        // END OF RULE N°2

        // RULE N°3
        // Lorsque deux consonnes se suivent, la césure s’effectue entre les deux, ce qui est toujours le cas dès lors qu’elles sont doublées.
        if (i < array.length - 1 && !isVowel(array[i], 'fr') && !isVowel(array[i+1], 'fr')) {
            if (i >= array.length - 2 || isVowel(array[i+2], 'fr')) {
                array.splice(i+1, 0, "¤");
                i += 1;
            } else {

                // RULE N°4
                // Lorsque trois consonnes se suivent la coupure doit s’effectuer après la deuxième sauf si on a deux consonnes identiques.
                if (array[i] === array[i+1] && array[i]) {
                    array.splice(i+1, 0, "¤");
                } else {
                    array.splice(i+2, 0, "¤");
                }
                i += 2;
                // END OF RULE N°4
            }
        // END OF RULE N°3

        // RULE N°5
        // La règle générale est de séparer les syllabes entre une voyelle et une consonne.
        } else if (i < array.length - 2 && isVowel(array[i], 'fr') && !isVowel(array[i+1], 'fr') && isVowel(array[i+2], 'fr')) {
            array.splice(i+1, 0, "¤")
            i++;
        }
        // END OF RULE N°5
    }
    
    return array.join("").split("¤");
}

function getSyllables(string, lang = "fr") {
    if (!isString(string)) throw "Not a String.";
    lang = lang.toLowerCase();

    let syllables = [];
    for (const w of string.split(" ")) {
        switch (lang) { 
            case "fr": 
            default:
                syllables = [...syllables, ...computefr(w)];
                break;
        }
    }

    return syllables;
}

function isString(a) {
    return typeof a === "string" || a instanceof String;
}

function isVowel(s, lang) {
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Enlève les diacritiques
    return VOWELS[lang].test(s);
}

function vorcFromBool(b) {
    return b?"v":"c";
}