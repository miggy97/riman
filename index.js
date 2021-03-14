const rimador = require('rimador');
const silabea = require('silabea');

function analyze(word1, word2) {
  //Validate word (Words have to be strings with only letters)
  if( word1 === '' || word1 === undefined || word1 === null || word2 === '' || word2 === undefined || word2 === null){
    return 'you need to enter two words';
  }
  if (typeof word1 !== 'string' || typeof word2 !== 'string') return "word need to be a String";
  if (!isOnlyLetters(word1) || !isOnlyLetters(word2)) return "word can only contain letters";
  //Transform to lowercase
  word1 = word1.toLowerCase();
  word2 = word2.toLowerCase();

  // Info of the rhyme that will be returned
  const rimaInfo = {
    riman: false,
    tipoRima: '', // Consonante, asonante, ninguno
    palabraUno: {
      palabra: word1,
      rimaConsonante: '',
      rimaAsonante: '',
      longitudPalabra: null,
      numSilabas: null,
      silabas: [],
      acentuacion: '', // Aguda, LLana o Esdrújula
      tonica: null,
      hiato: [],
      diptongo: [],
      triptongo: []
    },
    palabraDos: {
      palabra: word2,
      rimaConsonante: '',
      rimaAsonante: '',
      longitudPalabra: null,
      numSilabas: null,
      silabas: [],
      acentuacion: '', // Aguda, LLana o Esdrújula
      tonica: null,
      hiato: [],
      diptongo: [],
      triptongo: []
    },
  };

  const rimaWor1 = rimador.analyze(word1);
  const rimaWor2 = rimador.analyze(word2);
  const syllableWord1 = silabea.getSilabas(word1);
  const syllableWord2 = silabea.getSilabas(word2);


  /** Setting the info for the first word */
  rimaInfo.palabraUno.rimaConsonante = rimaWor1.rhyme;
  rimaInfo.palabraUno.rimaAsonante = rimaWor1.asonance;

  // If the consonat rhyme is not foud just take the hole word
  if (rimaInfo.palabraUno.rimaConsonante === '') {
    rimaInfo.palabraUno.rimaConsonante = word1;
  }

  // If the asonace rhyme is not foud just get the vowels
  if (rimaInfo.palabraUno.rimaAsonante === '') {
    rimaInfo.palabraUno.rimaAsonante = word1.match(/[AaEeIiOoUuÁáÉéÍíÓóÚúüÜ]/gi).join("");
  }

  rimaInfo.palabraUno.longitudPalabra = syllableWord1.longitudPalabra;
  rimaInfo.palabraUno.numSilabas = syllableWord1.numeroSilaba;

  // Push the syllables in an array
  for (let i = 0; i < syllableWord1.silabas.length; i++) {
    rimaInfo.palabraUno.silabas.push(syllableWord1.silabas[i].silaba);
  }

  rimaInfo.palabraUno.acentuacion = syllableWord1.acentuacion;
  rimaInfo.palabraUno.tonica = syllableWord1.tonica;

  for (hiato of syllableWord1.hiato) {
    rimaInfo.palabraUno.hiato.push(hiato.silabaHiato);
  }

  // Find diptongos
  for (silaba of rimaInfo.palabraUno.silabas) {
    let countVowelInRow = 0;
    let firstVowel = false;
    let diptongo = '';
    if (!isEspecialNotDiptongo(silaba)) {
      if (isEspecialDiptongo(silaba) !== false) {
        countVowelInRow = 2;
        diptongo = isEspecialDiptongo(silaba);
      } else {
        for (letra of silaba) {
          if (!firstVowel) {
            if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜ]/gi) !== null) {
              firstVowel = true;
              diptongo += letra;
              countVowelInRow++;
            }
          } else {
            if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYHhüÜ]/gi) !== null) {
              if (letra === 'h' || letra === "H") {
                diptongo += letra;
              } else {
                diptongo += letra;
                countVowelInRow++;
              }
            } else break;
          }
        }
      }
    }
    if (countVowelInRow === 2) {
      rimaInfo.palabraUno.diptongo.push(diptongo);
    }
  }

  // Find triptongos
  for (silaba of rimaInfo.palabraUno.silabas) {
    let countVowelInRow = 0;
    let firstVowel = false;
    let triptongo = '';
    if (isEspecialTriptongo(silaba) !== false) {
      countVowelInRow = 3;
      triptongo = isEspecialTriptongo(silaba);
    } else if (isEspecialDiptongo(silaba) === false) {
      for (letra of silaba) {
        if (!firstVowel) {
          if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜ]/gi) !== null) {
            firstVowel = true;
            triptongo += letra;
            countVowelInRow++;
          }
        } else {
          if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYHhüÜ]/gi) !== null) {
            if (letra === 'h' || letra === "H") {
              triptongo += letra;
            } else {
              triptongo += letra;
              countVowelInRow++;
            }
          } else break;
        }
      }
    }
    if (countVowelInRow === 3) {
      rimaInfo.palabraUno.triptongo.push(triptongo);
    }
  }

  rimaInfo.palabraDos.rimaConsonante = rimaWor2.rhyme;
  rimaInfo.palabraDos.rimaAsonante = rimaWor2.asonance;

  // If the consonat rhyme is not foud just take the hole word
  if (rimaInfo.palabraDos.rimaConsonante === '') {
    rimaInfo.palabraDos.rimaConsonante = word2;
  }

  // If the asonace rhyme is not foud just get the vowels
  if (rimaInfo.palabraDos.rimaAsonante === '') {
    rimaInfo.palabraDos.rimaAsonante = word2.match(/[AaEeIiOoUuÁáÉéÍíÓóÚúüÜ]/gi).join("");
  }

  rimaInfo.palabraDos.longitudPalabra = syllableWord2.longitudPalabra;
  rimaInfo.palabraDos.numSilabas = syllableWord2.numeroSilaba;

  // Push the syllables in an array
  for (let i = 0; i < syllableWord2.silabas.length; i++) {
    rimaInfo.palabraDos.silabas.push(syllableWord2.silabas[i].silaba);
  }

  rimaInfo.palabraDos.acentuacion = syllableWord2.acentuacion;
  rimaInfo.palabraDos.tonica = syllableWord2.tonica;

  for (hiato of syllableWord2.hiato) {
    rimaInfo.palabraDos.hiato.push(hiato.silabaHiato);
  }

  // Find diptongo
  for (silaba of rimaInfo.palabraDos.silabas) {
    let countVowelInRow = 0;
    let firstVowel = false;
    let diptongo = '';
    if (!isEspecialNotDiptongo(silaba)) {
      if (isEspecialDiptongo(silaba) !== false) {
        countVowelInRow = 2;
        diptongo = isEspecialDiptongo(silaba);
      } else {
        for (letra of silaba) {
          if (!firstVowel) {
            if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜ]/gi) !== null) {
              firstVowel = true;
              diptongo += letra;
              countVowelInRow++;
            }
          } else {
            if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYHhüÜ]/gi) !== null) {
              if (letra === 'h' || letra === "H") {
                diptongo += letra;
              } else {
                diptongo += letra;
                countVowelInRow++;
              }
            } else break;
          }
        }
      }
    }
    if (countVowelInRow === 2) {
      rimaInfo.palabraDos.diptongo.push(diptongo);
    }
  }

  for (silaba of rimaInfo.palabraDos.silabas) {
    let countVowelInRow = 0;
    let firstVowel = false;
    let triptongo = '';
    if (isEspecialTriptongo(silaba) !== false) {
      countVowelInRow = 3;
      triptongo = isEspecialTriptongo(silaba);
    } else if (isEspecialDiptongo(silaba) === false) {
      for (letra of silaba) {
        if (!firstVowel) {
          if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜ]/gi) !== null) {
            firstVowel = true;
            triptongo += letra;
            countVowelInRow++;
          }
        } else {
          if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYHhüÜ]/gi) !== null) {
            if (letra === 'h' || letra === "H") {
              triptongo += letra;
            } else {
              triptongo += letra;
              countVowelInRow++;
            }
          } else break;
        }
      }
    }
    if (countVowelInRow === 3) {
      rimaInfo.palabraDos.triptongo.push(triptongo);
    }
  }

  // Check if rhymes
  if (rimaInfo.palabraUno.rimaConsonante === rimaInfo.palabraDos.rimaConsonante) {
    rimaInfo.riman = true;
    rimaInfo.tipoRima = 'consonante';
  } else if (rimaInfo.palabraUno.rimaAsonante === rimaInfo.palabraDos.rimaAsonante) {
    rimaInfo.riman = true;
    rimaInfo.tipoRima = 'asonante';
  } else {
    rimaInfo.riman = false;
    rimaInfo.tipoRima = 'ninguna';
  }

  return rimaInfo;
}

// To vocal syllables that are not diptongo
function isEspecialNotDiptongo(syllable) {
  if (syllable === 'que' || syllable === 'qui' || syllable === 'gue' || syllable === 'gui') {
    return true;
  }
  return false;
}

// Returns the a diptongo of a syllable that start with que, qui, gue, gui, güi, güe
function isEspecialDiptongo(syllable) {
  if ((syllable.startsWith('que') || syllable.startsWith('gue')) && syllable.length >= 4) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      if (syllable[4] !== undefined && syllable[4].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) return false;
      return 'e' + syllable[3];
    }
    return false;
  } else if ((syllable.startsWith('qui') || syllable.startsWith('gui')) && syllable.length >= 4) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      if (syllable[4] !== undefined && syllable[4].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) return false;
      return 'i' + syllable[3];
    }
    return false;
  } else if (syllable === 'güe') {
    return 'üe';
  } else if (syllable === 'güi') {
    return 'üi';
  } else {
    return false;
  }
}

// Returns the a triptongo of a syllable that start with que, qui, gue, gui, güi, güe
function isEspecialTriptongo(syllable) {
  if ((syllable.startsWith('que') || syllable.startsWith('gue')) && syllable.length >= 5) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null && syllable[4].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      return 'e' + syllable[3] + syllable[4];
    }
    return false;
  } else if ((syllable.startsWith('qui') || syllable.startsWith('gui')) && syllable.length >= 5) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null && syllable[4].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      return 'i' + syllable[3] + syllable[4];
    }
    return false;
  } else if (syllable.startsWith('güe') && syllable.length >= 4) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      return 'üe' + syllable[3];
    }
    return false;
  } else if (syllable.startsWith('güi') && syllable.length >= 4) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      return 'üi' + syllable[3];
    }
    return false;
  } else {
    return false;
  }
}

function isOnlyLetters(word) {
  return /^[A-zÀ-úñÑüÜ]+$/.test(word);
}

module.exports.analyze = analyze;