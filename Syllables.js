const RULES = {
    fr: {
        separator: [['c','s','c'], ['v','s','c'], ['c', 'c', 's', 'c']],
        exception: ['ch', 'ph', 'th', 'gn', 'cr', 'br', 'tr', 'bl', 'cl', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'th', 'vr']
    }
}

function getSyllables(word, lang = "fr") {
    if (!isString(word)) throw "Not a String.";
    lang = lang.toLowerCase();

    const syllables = [];
    const vorcs = [];
    
    // Identify every char as consonant or vowel
    let appliedRule = [];
    for (let char of word) {
        vorcs.push(vorcFromBool(isVowel(char)));
    }

    let construct = ''; // Used to keep in memory some characters while constructing a syllable
    let shift = 0; // Used to iterate over word and so
    while (shift < word.length) {
        if (shift === 0) {
            construct += word.slice(shift, shift + 1);
            shift ++;
            continue;
        }
        // Look for rule to apply
        appliedRule = -1;
        for (let sepRules of RULES[lang].separator) {
            const sepRule = sepRules.filter(r => r !== "s").join('');
            const sepCons = vorcs.slice(shift, sepRule.length + shift).join('');
            if (sepCons === sepRule) appliedRule = sepRules;
        }

        if (appliedRule.length) {
            const beforeSep = appliedRule.slice(0, appliedRule.findIndex(e => e === "s")); // Get the part before separator
            const sepWord = word.slice(shift, beforeSep.length + shift);
            if (!RULES[lang].exception.includes(construct + sepWord)) {
                if (!(vorcs.slice(shift + beforeSep.length)).every(e => e === "c")) { 
                    // Set actual as a syllable (need of construct + sepWord)
                    console.log(sepWord, 'hey')
                    syllables.push(construct + sepWord);
                    // Shift to actual separator length
                    shift += beforeSep.length;
                    construct = '';
                } else { 
                    // If every remaining characters of the word is consonant
                    // Set the whole remaining characters as a syllable
                    console.log(word.slice(shift), 'heyo')
                    syllables.push(construct + word.slice(shift));
                    construct = '';
                    break;
                }
            } else { 
                // Shift by the length of the part before rule separator 
                shift += beforeSep.length;
                // Set construct as the exception 
                construct = sepWord;
            }
            
        } else { // Add character to construct if no rule to apply (especially for first char)
            construct += word.slice(shift, shift + 1);
            shift++;
        }
        
    }
    if (construct.length > 0) syllables.push(construct);

    // Loop for every single chars 
    const ret = [];
    // let unshift = 0;
    // for(let i = 0; i < syllables.length; i++) {
    //     if (syllables[i].length === 1) {
    //         ret[i - 1 - unshift] += syllables[i];
    //         unshift++;
    //     } else {
    //         ret.push(syllables[i]);
    //     }
    // }

    return syllables;
}

function isString(a) {
    return typeof a === "string" || a instanceof String;
}

function isVowel(s) {
    return (/^[aeiou]$/i).test(s);
}

function vorcFromBool(b) {
    return b?"v":"c";
}