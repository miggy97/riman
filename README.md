# riman
Comprueba si dos palabar en español **riman**.
> Check if two words **rhyme** in Spanish.

También te proporciona información relevante sobre las palabras como la rima asonante, la rima consonante, sílabas, la tónica...

> It also provides you with relevant information about words such as assonance rhyme, consonant rhyme, syllables, stressed syllable...

# Install

    npm install riman

## Usage
```js
const  riman = require('riman');
console.log(riman.analyze('programación', 'automatización'));
```

## Result

```js
{
  riman: true,
  tipoRima: 'consonante', // consonante | asonante
  palabraUno: {
    palabra: 'programación',
    rimaConsonante: 'on',
    rimaAsonante: 'o',
    longitudPalabra: 12,
    numSilabas: 4,
    silabas: [ 'pro', 'gra', 'ma', 'ción' ],
    acentuacion: 'Aguda', // Aguda | Grave (Llana) | Esdrújula
    tonica: 4,
    hiato: [], // For example 'a-e' or 'i-a'
    diptongo: [ 'ió' ],
    triptongo: []
  },
  palabraDos: {
    palabra: 'automatización',
    rimaConsonante: 'on',
    rimaAsonante: 'o',
    longitudPalabra: 14,
    numSilabas: 6,
    silabas: [ 'au', 'to', 'ma', 'ti', 'za', 'ción' ],
    acentuacion: 'Aguda', // Aguda | Grave (Llana) | Esdrújula
    tonica: 6,
    hiato: [], // For example 'a-e' or 'i-a'
    diptongo: [ 'au', 'ió' ],
    triptongo: []
  }
}
```   
    
## Values Definitions
**riman:** `boolean`  identifica si las dos palabras introducidas riman.

> **riman:** `boolean`  identify whether the two words entered rhyme.

**tipoRima:**`string`  si riman tanto las vocales como las consonantes desde la sílaba tónica, es rima [consonante](https://es.wikipedia.org/wiki/Rima_consonante), si solo riman las vocales, es rima [asonante](https://es.wikipedia.org/wiki/Asonancia).

> **tipoRima:**`string` if both vowels and consonants rhyme from the stressed syllable it is consonant rhyme, if only vowels rhyme it is
> assonance rhyme.

**palabraUno** y **palabraDos**: `object` contienen la información de las dos palabras.
>**palabraUno** y **palabraDos**: `object` they contain the information of the two words.

**palabra:**`string` la palabra introducida en minúscula.

> **palabra:**`string` the word entered in lowercase.

**rimaConsonante:**`string` terminación de la palabra desde la sílaba tónica teniendo en cuenta consonantes y vocales.

> **rimaConsonante:**`string` word ending from the stressed syllable taking into account consonants and vowels.

**rimaAsonante:**`string` terminación de la palabra desde la sílaba tónica teniendo en cuenta solo las vocales.

> **rimaAsonante:**`string` word ending from the stressed syllable taking into account only vowels. 

**longitudPalabra:**`number` número de letras que tiene la palabra.

> **longitudPalabra:**`number` number of letters in the word.

**numSilabas:**`number` número de sílabas de la palabra.

> **numSilabas:**`number` number of syllables in the word.

**silabas:**`array` palabra separada por sílabas.

> **silabas:**`array` word separated by syllables.

**acentuacion:**`string`  indica si la palabra es Aguda, LLana o Esdrújula. Si la sílaba tónica es la última, la palabra es **Aguda**, si es la penúltima, es **LLana** y si es la antepenúltima, es **Esdrújula**.
>**acentuacion:**`string` indicates if the word is Aguda, LLana or Esdrújula.  words stressed on the last syllable are **Aguda**, the penultimate syllable are **Llana**, and the antepenultimate syllable are **Esdrújula**. 

**tonica:**`number` indica la posición de la sílaba que tiene el acento de la palabra, pero no necesariamente lleva tilde. Es decir, la sílaba que pronunciamos con más fuerza.

> **tonica:**`number` indicates syllable position that has the accent of the word, but does not necessarily have an accent mark. That is to say the stressed syllable.

**hiato:**`array` muestra si hay dos vocales seguidas que están en diferentes sílabas.

> **hiato:**`array` shows if there are two vowels in a row that are in different syllables (hiatus).

**diptongo:**`array` muestra si hay dos vocales seguidas en la misma sílaba.

> **diptongo:**`array` shows if there are two vowels in a row on the same syllable (diphthong).

**triptongo:**`array` muestra si hay tres vocales seguidas en la misma sílaba.

> **triptongo:**`array` shows if there are three vowels in a row on the same syllable (triphthong).

## Related
He utilizado dos módulos de npm, **rimador** y **silabea**. Ambas librerías son **antiguas**, nadie las mantiene y tienen **errores**. He rehecho algunas de sus funcionalidades y las he **mejorado**.

> I have used two npm modules, **rimador** and **silabea**. Both
> libraries are **old**, nobody maintains them and they have **errors**.
> I have redone some of its functionalities and **improved** them.

AYUDAME A MEJORAR ESTA LIBRERÍA REPORTANDO LOS ERRORES EN GITHUB

> HELP ME IMPROVE THIS LIBRARY BY REPORTING BUGS IN GITHUB
