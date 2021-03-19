import { rimaInfo, palabraInfo } from "./types";
import * as rimador from "rimador";
import * as silabea from "silabea";

export function analyze(word1: string, word2: string): rimaInfo {
  //Validate word (Words have to be strings with only letters)
  if (word1 === "" || word2 === "") {
    throw new Error("you need to enter two words");
  }
  //Check if words have characters that are not letters
  if (!isOnlyLetters(word1) || !isOnlyLetters(word2))
    throw new Error("A word can only contain letters");
  word1 = word1.toLowerCase();
  word2 = word2.toLowerCase();

  const rimaInfo: rimaInfo = {
    riman: false,
    tipoRima: "", // Consonante, asonante, ninguno
    palabraUno: {
      palabra: word1,
      rimaConsonante: "",
      rimaAsonante: "",
      longitudPalabra: 0,
      numSilabas: 0,
      silabas: [],
      acentuacion: "", // Aguda, LLana o Esdrújula
      tonica: 0,
      EsPrimeraVocal: false,
      EsUltimaVocal: false,
      EsPrimeraVocalTonica: false,
      hiato: [],
      diptongo: [],
      triptongo: [],
    },
    palabraDos: {
      palabra: word2,
      rimaConsonante: "",
      rimaAsonante: "",
      longitudPalabra: 0,
      numSilabas: 0,
      silabas: [],
      acentuacion: "", // Aguda, LLana o Esdrújula
      tonica: 0,
      EsPrimeraVocal: false,
      EsUltimaVocal: false,
      EsPrimeraVocalTonica: false,
      hiato: [],
      diptongo: [],
      triptongo: [],
    },
  };

  const rimaWord1 = rimador.analyze(word1);
  const rimaWord2 = rimador.analyze(word2);
  const syllableWord1 = silabea.getSilabas(word1);
  const syllableWord2 = silabea.getSilabas(word2);

  /** SETTING THE INFO FOR FIRST WORD */
  rimaInfo.palabraUno.rimaConsonante = rimaWord1.rhyme;
  rimaInfo.palabraUno.rimaAsonante = rimaWord1.asonance;

  // If the consonat rhyme is not foud just take the hole word
  if (rimaInfo.palabraUno.rimaConsonante === "") {
    if (word1.endsWith("y")) {
      rimaInfo.palabraUno.rimaConsonante = word1.slice(0, -1) + "i";
    } else {
      rimaInfo.palabraUno.rimaConsonante = word1;
    }
  }

  // If the asonace rhyme is not foud just get the vowels
  if (rimaInfo.palabraUno.rimaAsonante === "") {
    let transformedWord = word1;
    if (word1.endsWith("y")) {
      transformedWord = word1.slice(0, -1) + "i";
    }
    rimaInfo.palabraUno.rimaAsonante =
      transformedWord.match(/[AaEeIiOoUuÁáÉéÍíÓóÚúüÜ]/gi)?.join("") ??
      "Sin rima asonante";
  }

  rimaInfo.palabraUno.longitudPalabra = syllableWord1.longitudPalabra;
  rimaInfo.palabraUno.numSilabas = syllableWord1.numeroSilaba;

  // Push the syllables in an array
  for (let i = 0; i < syllableWord1.silabas.length; i++) {
    rimaInfo.palabraUno.silabas.push(syllableWord1.silabas[i].silaba);
  }

  rimaInfo.palabraUno.acentuacion = syllableWord1.acentuacion;
  rimaInfo.palabraUno.tonica = syllableWord1.tonica;

  // Check if first letter is a vowel
  if (
    rimaInfo.palabraUno.silabas[0][0].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜ]/gi) !=
    null
  ) {
    rimaInfo.palabraUno.EsPrimeraVocal = true;

    //Check if the word starts with a vowel and is the stressed syllable
    if (rimaInfo.palabraUno.tonica === 1) {
      rimaInfo.palabraUno.EsPrimeraVocalTonica = true;
    }
  }

  // Check if last letter is a vowel
  if (word1[word1.length - 1].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜyY]/gi)) {
    rimaInfo.palabraUno.EsUltimaVocal = true;
  }

  //Add hiatos
  for (let hiato of syllableWord1.hiato) {
    rimaInfo.palabraUno.hiato.push(hiato.silabaHiato);
  }

  //Fix word that ends with stressed 'uy'
  let lastSyllable =
    rimaInfo.palabraUno.silabas[rimaInfo.palabraUno.silabas.length - 1];
  if (
    lastSyllable.length >= 2 &&
    lastSyllable[lastSyllable.length - 2] === "u" &&
    lastSyllable[lastSyllable.length - 1] === "y" &&
    rimaInfo.palabraUno.acentuacion === "Aguda"
  ) {
    rimaInfo.palabraUno.rimaConsonante = "ui";
    rimaInfo.palabraUno.rimaAsonante = "ui";
  }

  //Getting the triptongos and diptongos
  rimaInfo.palabraUno.diptongo = findRowSyllabes(
    rimaInfo.palabraUno.silabas,
    2
  );
  rimaInfo.palabraUno.triptongo = findRowSyllabes(
    rimaInfo.palabraUno.silabas,
    3
  );

  /** SETTING THE INFO FOR SECOND WORD */
  rimaInfo.palabraDos.rimaConsonante = rimaWord2.rhyme;
  rimaInfo.palabraDos.rimaAsonante = rimaWord2.asonance;

  // If the consonat rhyme is not foud just take the hole word
  if (rimaInfo.palabraDos.rimaConsonante === "") {
    if (word2.endsWith("y")) {
      rimaInfo.palabraDos.rimaConsonante = word2.slice(0, -1) + "i";
    } else {
      rimaInfo.palabraDos.rimaConsonante = word2;
    }
  }

  // If the asonace rhyme is not foud just get the vowels
  if (rimaInfo.palabraDos.rimaAsonante === "") {
    let transformedWord = word2;
    if (word1.endsWith("y")) {
      transformedWord = word2.slice(0, -1) + "i";
    }
    rimaInfo.palabraDos.rimaAsonante =
      transformedWord.match(/[AaEeIiOoUuÁáÉéÍíÓóÚúüÜ]/gi)?.join("") ??
      "Sin rima asonante";
  }

  rimaInfo.palabraDos.longitudPalabra = syllableWord2.longitudPalabra;
  rimaInfo.palabraDos.numSilabas = syllableWord2.numeroSilaba;

  // Push the syllables in an array
  for (let i = 0; i < syllableWord2.silabas.length; i++) {
    rimaInfo.palabraDos.silabas.push(syllableWord2.silabas[i].silaba);
  }

  rimaInfo.palabraDos.acentuacion = syllableWord2.acentuacion;
  rimaInfo.palabraDos.tonica = syllableWord2.tonica;

  // Check if first letter is a vowel
  if (
    rimaInfo.palabraDos.silabas[0][0].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜ]/gi) !=
    null
  ) {
    rimaInfo.palabraDos.EsPrimeraVocal = true;

    //Check if the word starts with a vowel and is the stressed syllable
    if (rimaInfo.palabraDos.tonica === 1) {
      rimaInfo.palabraDos.EsPrimeraVocalTonica = true;
    }
  }

  // Check if last letter is a vowel
  if (word2[word2.length - 1].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜyY]/gi)) {
    rimaInfo.palabraDos.EsUltimaVocal = true;
  }

  //Add hiatos
  for (let hiato of syllableWord1.hiato) {
    rimaInfo.palabraDos.hiato.push(hiato.silabaHiato);
  }

  //Fix word that ends with stressed 'uy'
  lastSyllable =
    rimaInfo.palabraDos.silabas[rimaInfo.palabraDos.silabas.length - 1];
  if (
    lastSyllable.length >= 2 &&
    lastSyllable[lastSyllable.length - 2] === "u" &&
    lastSyllable[lastSyllable.length - 1] === "y" &&
    rimaInfo.palabraDos.acentuacion === "Aguda"
  ) {
    rimaInfo.palabraDos.rimaConsonante = "ui";
    rimaInfo.palabraDos.rimaAsonante = "ui";
  }

  //Getting the triptongos and diptongos
  rimaInfo.palabraDos.diptongo = findRowSyllabes(
    rimaInfo.palabraDos.silabas,
    2
  );
  rimaInfo.palabraDos.triptongo = findRowSyllabes(
    rimaInfo.palabraDos.silabas,
    3
  );

  // Check if rhymes
  if (
    rimaInfo.palabraUno.rimaConsonante === rimaInfo.palabraDos.rimaConsonante
  ) {
    rimaInfo.riman = true;
    rimaInfo.tipoRima = "consonante";
  } else if (
    rimaInfo.palabraUno.rimaAsonante === rimaInfo.palabraDos.rimaAsonante
  ) {
    rimaInfo.riman = true;
    rimaInfo.tipoRima = "asonante";
  } else {
    rimaInfo.riman = false;
    rimaInfo.tipoRima = "ninguna";
  }

  return rimaInfo;
}

export function analyzeWord(word: string): palabraInfo {
  //Validate word (Words have to be strings with only letters)
  if (word === "") {
    throw new Error("you need to enter a word");
  }
  //Check if words have characters that are not letters
  if (!isOnlyLetters(word)) throw new Error("A word can only contain letters");
  //Transform to lowercase
  word = word.toLowerCase();

  const palabra: palabraInfo = {
    palabra: word,
    rimaConsonante: "",
    rimaAsonante: "",
    longitudPalabra: 0,
    numSilabas: 0,
    silabas: [],
    acentuacion: "", // Aguda, LLana o Esdrújula
    tonica: 0,
    EsPrimeraVocal: false,
    EsUltimaVocal: false,
    EsPrimeraVocalTonica: false,
    hiato: [],
    diptongo: [],
    triptongo: [],
  };

  const rimaWord = rimador.analyze(word);
  const syllableWord = silabea.getSilabas(word);

  /** Setting the info for the first word */
  palabra.rimaConsonante = rimaWord.rhyme;
  palabra.rimaAsonante = rimaWord.asonance;

  // If the consonat rhyme is not foud just take the hole word
  if (palabra.rimaConsonante === "") {
    if (word.endsWith("y")) {
      palabra.rimaConsonante = word.slice(0, -1) + "i";
    } else {
      palabra.rimaConsonante = word;
    }
  }

  // If the asonace rhyme is not foud just get the vowels
  if (palabra.rimaAsonante === "") {
    let transformedWord = word;
    if (word.endsWith("y")) {
      transformedWord = transformedWord.slice(0, -1) + "i";
    }
    palabra.rimaAsonante =
      transformedWord.match(/[AaEeIiOoUuÁáÉéÍíÓóÚúüÜ]/gi)?.join("") ??
      "Sin rima asonante";
  }

  palabra.longitudPalabra = syllableWord.longitudPalabra;
  palabra.numSilabas = syllableWord.numeroSilaba;

  // Push the syllables in an array
  for (let i = 0; i < syllableWord.silabas.length; i++) {
    palabra.silabas.push(syllableWord.silabas[i].silaba);
  }

  palabra.acentuacion = syllableWord.acentuacion;
  palabra.tonica = syllableWord.tonica;

  //Fix word that ends with stressed 'uy'
  const lastSyllable = palabra.silabas[palabra.silabas.length - 1];
  if (
    lastSyllable.length >= 2 &&
    lastSyllable[lastSyllable.length - 2] === "u" &&
    lastSyllable[lastSyllable.length - 1] === "y" &&
    palabra.acentuacion === "Aguda"
  ) {
    palabra.rimaConsonante = "ui";
    palabra.rimaAsonante = "ui";
  }

  for (let hiato of syllableWord.hiato) {
    palabra.hiato.push(hiato.silabaHiato);
  }

  // Check if first letter is a vowel
  if (palabra.silabas[0][0].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜ]/gi) != null) {
    palabra.EsPrimeraVocal = true;

    //Check if the word starts with a vowel and is the stressed syllable
    if (palabra.tonica === 1) {
      palabra.EsPrimeraVocalTonica = true;
    }
  }

  // Check if last letter is a vowel
  if (word[word.length - 1].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜyY]/gi)) {
    palabra.EsUltimaVocal = true;
  }

  //Find diptongos and triptongos
  palabra.diptongo = findRowSyllabes(palabra.silabas, 2);
  palabra.triptongo = findRowSyllabes(palabra.silabas, 3);

  return palabra;
}

//Finds sequences of syllables (diptongos and triptongos)
function findRowSyllabes(silabas: string[], amount: number): string[] {
  const result: string[] = [];
  for (let silaba of silabas) {
    let countVowelInRow = 0;
    let firstVowel = false;
    let vowelSequence: string = "";
    if (!isEspecialNotDiptongo(silaba)) {
      if (isEspecialDiptongo(silaba) !== "") {
        countVowelInRow = 2;
        vowelSequence = isEspecialDiptongo(silaba);
      } else if (isEspecialTriptongo(silaba) !== "") {
        countVowelInRow = 3;
        vowelSequence = isEspecialTriptongo(silaba);
      } else {
        for (let letra of silaba) {
          if (!firstVowel) {
            if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúüÜ]/gi) !== null) {
              firstVowel = true;
              vowelSequence += letra;
              countVowelInRow++;
            }
          } else {
            if (letra.match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYHhüÜ]/gi) !== null) {
              if (letra === "h" || letra === "H") {
                vowelSequence += letra;
              } else {
                vowelSequence += letra;
                countVowelInRow++;
              }
            } else break;
          }
        }
      }
    }
    if (countVowelInRow === amount) {
      result.push(vowelSequence);
    }
  }
  return result;
}

// To vocal syllables that are not diptongo
function isEspecialNotDiptongo(syllable: string): boolean {
  if (
    syllable === "que" ||
    (syllable.length > 3 &&
      syllable.startsWith("que") &&
      syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) === null)
  ) {
    return true;
  } else if (
    syllable === "qui" ||
    (syllable.length > 3 &&
      syllable.startsWith("qui") &&
      syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) === null)
  ) {
    return true;
  } else if (
    syllable === "gue" ||
    (syllable.length > 3 &&
      syllable.startsWith("gue") &&
      syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) === null)
  ) {
    return true;
  } else if (
    syllable === "gui" ||
    (syllable.length > 3 &&
      syllable.startsWith("gui") &&
      syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) === null)
  ) {
    return true;
  } else {
    return false;
  }
}

// Returns the a diptongo of a syllable that start with que, qui, gue, gui, güi, güe
function isEspecialDiptongo(syllable: string): string {
  if (
    (syllable.startsWith("que") || syllable.startsWith("gue")) &&
    syllable.length >= 4
  ) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      if (
        syllable[4] !== undefined &&
        syllable[4].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null
      )
        return "";
      return "e" + syllable[3];
    }
    return "";
  } else if (
    (syllable.startsWith("qui") || syllable.startsWith("gui")) &&
    syllable.length >= 4
  ) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      if (
        syllable[4] !== undefined &&
        syllable[4].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null
      )
        return "";
      return "i" + syllable[3];
    }
    return "";
  } else if (syllable === "güe") {
    return "üe";
  } else if (syllable === "güi") {
    return "üi";
  } else {
    return "";
  }
}

// Returns the a triptongo of a syllable that start with que, qui, gue, gui, güi, güe
function isEspecialTriptongo(syllable: string): string {
  if (
    (syllable.startsWith("que") || syllable.startsWith("gue")) &&
    syllable.length >= 5
  ) {
    if (
      syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null &&
      syllable[4].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null
    ) {
      return "e" + syllable[3] + syllable[4];
    }
    return "";
  } else if (
    (syllable.startsWith("qui") || syllable.startsWith("gui")) &&
    syllable.length >= 5
  ) {
    if (
      syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null &&
      syllable[4].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null
    ) {
      return "i" + syllable[3] + syllable[4];
    }
    return "";
  } else if (syllable.startsWith("güe") && syllable.length >= 4) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      return "üe" + syllable[3];
    }
    return "";
  } else if (syllable.startsWith("güi") && syllable.length >= 4) {
    if (syllable[3].match(/[AaÁáEeÉeIiÍíOoÓóUuÚúyYüÜ]/gi) !== null) {
      return "üi" + syllable[3];
    }
    return "";
  } else {
    return "";
  }
}

function isOnlyLetters(word: string): boolean {
  return /^[A-zÀ-úñÑüÜ]+$/.test(word);
}
