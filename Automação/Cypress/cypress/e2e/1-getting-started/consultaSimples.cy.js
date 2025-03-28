/// <reference types="cypress" />
describe('Amazon Search Test', () => {
        it('should search for "Casa" on Amazon and verify results', () => {
            cy.visit('https://www.amazon.com.br');
            cy.get('#twotabsearchtextbox').type('Casa');
            cy.get('#nav-search-submit-button').click();
            cy.get('.s-main-slot').find('.s-result-item').then(($results) => {
                const resultCount = $results.length;
                cy.xpath('//*[@id="search"]/span/div/h1/div/div[1]/div/h2/span[1]').invoke('text').then((text) => {
                    console.log(`Number of results: ${text}`);
                    cy.log(`Number of results: ${text}`);
                    expect(resultCount).to.be.greaterThan(0);
                });    });
        });


        
    });