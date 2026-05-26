/**
 * Gera um número pseudoaleatório baseado em uma semente numérica.
 * Implementação do algoritmo Linear Congruential Generator (LCG).
 * @param {number} seed - A semente para inicializar o gerador.
 * @returns {function} Uma função que retorna um float entre 0 e 1.
 */
function createRandomGenerator(seed: any) {
  // Parâmetros clássicos do LCG (valores numéricos padrão do Numerical Recipes)
  const m = 2147483648 // 2^31
  const a = 1103515245
  const c = 12345

  let currentSeed = seed

  return function () {
    currentSeed = (a * currentSeed + c) % m
    return currentSeed / m
  }
}

/**
 * Retorna um número inteiro determinístico entre 1 e 1350 baseado no dia atual.
 * @returns {number} Número gerado
 */
export function getDailyRandomNumber() {
  const today = new Date()

  // Criação da semente baseada em YYYYMMDD para consistência de fuso horário local
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  const seed = parseInt(`${year}${month}${day}`, 10)

  // Inicializa o gerador com a semente do dia
  const random = createRandomGenerator(seed)

  // Mapeia o float de 0-1 para o intervalo desejado [1, 1350]
  // Correção aplicada: Math.floor(random() * (max - min + 1)) + min
  return Math.floor(random() * 1350) + 1
}
