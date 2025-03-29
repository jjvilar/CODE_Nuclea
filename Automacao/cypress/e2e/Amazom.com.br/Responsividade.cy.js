// Ajuda o VSCode a entender o que é o arquivo e a fornecer recursos de autocompletar
/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
require('cypress-xpath');
import 'cypress-xpath';

describe('Teste de Responsividade - Amazon', () => {
    const viewports = [
        { device: 'iPhone X', width: 375, height: 812 },
        { device: 'iPad', width: 768, height: 1024 },
        { device: 'Desktop', width: 1920, height: 1080 },
        /*
        { device: 'Chromebook', width: 1366, height: 768 },
        { device: 'Galaxy S5', width: 360, height: 640 },
        { device: 'Galaxy Tab S6', width: 800, height: 1280 },
        { device: 'Galaxy Note 10+', width: 412, height: 915 },
        { device: 'Galaxy S20', width: 360, height: 800 },
        { device: 'iPhone 12 Pro', width: 390, height: 844 },
        { device: 'iPad Mini', width: 768, height: 1024 },
        { device: 'iPad Pro', width: 1024, height: 1366 },
        { device: 'MacBook Air', width: 1440, height: 900 },
        { device: 'MacBook Pro 13', width: 1280, height: 800 },
        */
    ];

    beforeEach(() => {
        cy.visit('https://www.amazon.com.br');
    });

    // Função para capturar prints de tela
    function capturarPrint(deviceName) {
        // Gera um timestamp único
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); 
        // Nome do arquivo começa com "Tela_" seguido do nome do dispositivo e timestamp
        const nomeDoPrint = `Tela_${deviceName}_${timestamp}`; 
        // Captura o print de tela e salva com o nome gerado
        cy.screenshot(nomeDoPrint, { capture: 'viewport' }); 
    }

    viewports.forEach((viewport) => {
        it(`Deve exibir corretamente no dispositivo: ${viewport.device}`, () => {
            // Define o tamanho da viewport
            cy.viewport(viewport.width, viewport.height); 
            // Aguarda o layout carregar
            cy.wait(2000); 
    
            // Localiza e clica no botão item menu hamburger "Todos"
            cy.get('#nav-hamburger-menu').click();
            // Valida que o menu lateral foi aberto
            cy.get('.hmenu-visible').should('be.visible');
            // Captura o print da tela para o dispositivo atual
            capturarPrint(viewport.device); 
            // Fecha o menu lateral teclando na tecla ESC
            cy.get('body').type('{esc}');
            // Valida que o menu lateral foi fechado
            cy.get('.hmenu-visible').should('not.exist');
            // Captura o print da tela para o dispositivo atual
            capturarPrint(viewport.device); 

            
           // Valida e interage com o primeiro item do menu lateral
           cy.get('.nav-ul > :nth-child(1) > .nav-div > .nav-a')
           .should('be.visible')
           .invoke('text')
           .then((text) => {
               // Valida o texto do primeiro item do menu lateral
               expect(text.trim()).to.equal('Venda na Amazon');
               // Clica no primeiro item do menu lateral
               cy.get('.nav-ul > :nth-child(1) > .nav-div > .nav-a').click();
               // Valida o título da página
               cy.get('.padding-right-xxlarge > .text')
                   .invoke('text')
                   .then((text) => {
                    expect(text.trim()).to.equal('Aproveite todos os benefícios de vender na Amazon com mensalidade GRÁTIS por 1 ano.');
                   });
               // Captura o print da tela para o dispositivo atual
               capturarPrint(viewport.device, 'pagina_venda_na_amazon');
           });
            /*
            cy.get('.nav-ul > :nth-child(2) > .nav-div > .nav-a') 
                .should('be.visible')
                .invoke('text')
                .then((text) => {
                    // Valida o texto do segundo item do menu lateral
                    expect(text.trim()).to.equal('Mais Vendidos');
                });
            cy.get('.nav-ul > :nth-child(3) > .nav-div > .nav-a')
                .should('be.visible')
                .invoke('text')
                .then((text) => {
                    // Valida o texto do terceiro item do menu lateral
                    expect(text.trim()).to.equal('Lançamentos');
                });
            cy.get('.nav-ul > :nth-child(4) > .nav-div > .nav-a')
                .should('be.visible')
                .invoke('text')
                .then((text) => {
                    // Valida o texto do quarto item do menu lateral
                    expect(text.trim()).to.equal('Mais Comprados');
                });
            */

        });
    });
});