// Ajuda o VSCode a entender o que é o arquivo e a fornecer recursos de autocompletar
/// <reference types="cypress" />

// Função para capturar prints de tela
function capturarPrint() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Gera um timestamp único
  const nomeDoPrint = `Tela_${timestamp}`; // Nome do arquivo começa com "Tela_" seguido do timestamp
  cy.screenshot(nomeDoPrint);
}

describe('RT - Autocomplete', () => {
  //Antes de cada teste, acessa a página da Amazon CT-0001
  beforeEach(() => {
    cy.visit('https://www.amazon.com.br/')
  })

  //CT-0002
  it.skip('Verificar a apresentação do campo de pesquisa', () => {
    // Valida que o campo de pesquisa está visível
    cy.get('#twotabsearchtextbox').should('be.visible')
     // Captura o print da tela
     capturarPrint();
  })

  //CT-0003
  it('Deve preencher o campo de pesquisa e selecionar um item', () => {
    // Preenche o campo de pesquisa
    cy.get('#twotabsearchtextbox').type('iphone 11')

    // Aguarda as sugestões aparecerem e valida que existem sugestões
    cy.get('.s-suggestion').should('be.visible')

    // Seleciona a primeira sugestão
    cy.get('.s-suggestion').first().click()

    // Valida que a página de resultados foi carregada
    cy.url().should('include', 'k=iphone+11')
    
    // Captura o print da tela
    capturarPrint();
  })
})
