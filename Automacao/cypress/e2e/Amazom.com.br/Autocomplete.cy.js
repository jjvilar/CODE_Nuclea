// Ajuda o VSCode a entender o que é o arquivo e a fornecer recursos de autocompletar
/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
require('cypress-xpath');
import 'cypress-xpath';

// Função para capturar prints de tela
function capturarPrint() {
  // Gera um timestamp único
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); 
  // Nome do arquivo começa com "Tela_" seguido do timestamp
  const nomeDoPrint = `Tela_${timestamp}`; 
  // Captura o print de tela e salva com o nome gerado
  // Captura apenas o conteúdo visível
  cy.screenshot(nomeDoPrint, { capture: 'viewport' }); 
  // Captura o print de tela e salva com o nome gerado todo o conteúdo da página
  //cy.screenshot(nomeDoPrint);
}

describe('RT - Autocomplete', () => {
  //Antes de cada teste, acessa a página da Amazon CT-0001
  beforeEach(() => {
    cy.visit('https://www.amazon.com.br/')
  })

  //Depois de cada teste, captura um print da tela
  afterEach(() => {
    capturarPrint();
  })
  
  //CT-0002
  it.skip('Verificar a apresentação do campo de pesquisa', () => {
    // Valida que o campo de pesquisa está visível
    cy.get('#twotabsearchtextbox').should('be.visible')
  })

  //CT-0003
  it.skip('Sugestões de pesquisa com caracteres', () => {
    // Preenche o campo de pesquisa
    cy.get('#twotabsearchtextbox').type('a')
    // Aguarda as sugestões aparecerem e valida que existem sugestões
    cy.get('.s-suggestion').should('be.visible')
  })

  //CT-0004
  it('Sugestões de pesquisa com caracteres', () => {
    // Preenche o campo de pesquisa
    cy.get('#twotabsearchtextbox').type('a')
    // Aguarda as sugestões aparecerem e valida que existem sugestões
    cy.get('.s-suggestion').should('be.visible')
    // Faz a captura da tela
    capturarPrint()
    // Preenche o campo de pesquisa
    cy.get('#twotabsearchtextbox').type('m')
    // Aguarda as sugestões aparecerem e valida que existem sugestões
    cy.get('.s-suggestion').should('be.visible')
    // Faz a captura da tela
    capturarPrint()
    // Preenche o campo de pesquisa
    cy.get('#twotabsearchtextbox').type('c')
    // Aguarda as sugestões aparecerem e valida que existem sugestões
    cy.get('.s-suggestion').should('be.visible')
  })

  //Casos de CT-0005
  it.skip('Deve preencher o campo de pesquisa e selecionar um item', () => {
    // Preenche o campo de pesquisa
    cy.get('#twotabsearchtextbox').type('iphone')
    // Aguarda as sugestões aparecerem e valida que existem sugestões
    cy.get('.s-suggestion').should('be.visible')
    // Faz a captura da tela
    capturarPrint()
    // Captura a quantidade de sugestões
    cy.get('.s-suggestion').its('length').then((qtdSugestoes) => {
      // Valida que a quantidade de sugestões é maior que zero
      expect(qtdSugestoes).to.be.greaterThan(0)
    })
    // Seleciona a primeira sugestão
    cy.get('.s-suggestion').first().click()
    // Valida que a página de resultados contém parte do nome do item pesquisado
    cy.get('span.a-color-state').should('contain.text', 'iphone'); 
  })

  


  

})
