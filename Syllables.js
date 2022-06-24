const VOWELS = {
    fr: new RegExp(/^[aeiouy]$/i)
}

const GRP_EXCEPTION = ["ch", "ph", "th", "gn", "zr", "zl", "tr", "tl", "pr", "pl", "dl", "dr", "fr", "fl", "gr", "gl", "kl", "kr", "cr", "cl", "jr", "jl", "qr", "ql", "br", "bl", "vr", "vl", "m.", "mm.", "mr.", "mrs.", "miss.", "ms."];

function computefr(str) {
    const array = [];
    // RULE N°1
    // On ne sépare jamais les groupes de consonnes « ch » , « ph » , « th » , « gn »
    let j = 0;
    for (let i = 0; i < str.length; i++) {
        let grp_applied = '';
        for (let k = 0; k < GRP_EXCEPTION.length; k++) {
            if ((array[j-1] + str.slice(i)).length >= GRP_EXCEPTION[k].length && grp_applied.length < GRP_EXCEPTION[k].length) {
                if ((array[j-1] + str.slice(i, i + GRP_EXCEPTION[k].length - 1)).toLowerCase() === GRP_EXCEPTION[k]) {
                    grp_applied = array[j-1] + str.slice(i, i + GRP_EXCEPTION[k].length - 1);
                }
            }
        }
        
        if (grp_applied.length === 0) {
            array.push(str[i]);
        } else {
            array[j-1] = grp_applied;
            i += grp_applied.length - 2;
            j--;
        }
        j++;
    }
    // END OF RULE N°1

    for (let i = 0; i < array.length; i++) {
        // RULE N°2
        // Si la fin d'un mot se termine que par des consonnes il n'y a pas de coupure
        if ((array.slice(i)).every(v => !isVowel(v))) {
            const delArray = array.splice(i, array.length-1);
            array.push(delArray.join(""));
            break;
        }
        // END OF RULE N°2

        // RULE N°3
        // Lorsque deux consonnes se suivent, la césure s’effectue entre les deux, ce qui est toujours le cas dès lors qu’elles sont doublées.
        if (i < array.length - 1 && !isVowel(array[i]) && !isVowel(array[i+1])) {
            if (i >= array.length - 2 || isVowel(array[i+2])) {
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
        } 
        
    }

    // RULE N°5
    // La règle générale est de séparer les syllabes entre une voyelle et une consonne.
    for (let i = 0; i < array.length; i++) {        
        if (i < array.length - 2 && isVowel(array[i])) {
            if (array[i+1].length > 1 && !isStrFullConsonant(array[i+1]) && (isVowel(array[i+2]) || array[i+2] === "¤")) {
                array.splice(i+1, 0, "¤")
                i++;
            } else if (!isVowel(array[i+1]) && isVowel(array[i+2])) {
                
                array.splice(i+1, 0, "¤")
                i++;
            }
        }
    }
    // END OF RULE N°5

    return array.join("").split("¤");
}

function getSyllables(string, lang = "fr") {
    if (!isString(string)) throw "Not a String.";
    lang = lang.toLowerCase();

    let syllables = [];
    for (let w of string.split(" ")) {
        w = w.replace(/(\r\n|\n|\r)/gm, "");
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

function isVowel(s, lang="fr") {
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Enlève les diacritiques
    return VOWELS[lang].test(s);
}

function isStrFullVowel(s, lang="fr") {
    let ret = true;
    for (const c of s) {
        if (!isVowel(c, lang)) {
            ret = false;
            break;
        }
    }
    return ret;
}

function isStrFullConsonant(s, lang="fr") {
    let ret = true;
    for (const c of s) {
        if (isVowel(c, lang)) {
            ret = false;
            break;
        }
    }
    return ret;
}