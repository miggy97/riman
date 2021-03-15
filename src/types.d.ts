export interface rimaInfo {
  riman:boolean
  tipoRima: string
  palabraUno: palabraInfo
  palabraDos: palabraInfo
}

export interface palabraInfo {
  palabra: string
  rimaConsonante: string
  rimaAsonante: string
  longitudPalabra: number
  numSilabas: number
  silabas: string[]
  acentuacion: string
  tonica: number
  EsPrimeraVocal: boolean
  EsUltimaVocal: boolean
  EsPrimeraVocalTonica: boolean
  hiato: string[]
  diptongo: string[]
  triptongo: string[]
}