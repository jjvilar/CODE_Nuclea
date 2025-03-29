// Ajuda o VSCode a entender o que é o arquivo e a fornecer recursos de autocompletar
/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
require('cypress-xpath');
import 'cypress-xpath';

describe('Análise de Carregamento e Desempenho - Amazon', () => {
    // Gera um nome único para o arquivo de relatório com base no timestamp formatado
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0'); // Dia com 2 dígitos
    const mes = String(now.getMonth() + 1).padStart(2, '0'); // Mês com 2 dígitos
    const ano = String(now.getFullYear()).slice(2); // Últimos 2 dígitos do ano
    const hora = String(now.getHours()).padStart(2, '0'); // Hora com 2 dígitos
    const minuto = String(now.getMinutes()).padStart(2, '0'); // Minuto com 2 dígitos
    const timestamp = `${dia}${mes}${ano}_${hora}${minuto}`; // Formato ddmmaa_hhmm

    const resultadoArquivo = `cypress/results/desempenho_resultados_${timestamp}.txt`; // Caminho do arquivo para salvar os resultados
    const navegadores = ['chrome', 'edge', 'firefox', 'electron']; // Lista de navegadores para os testes

    before(() => {
        // Limpa o arquivo antes de iniciar os testes
        cy.writeFile(resultadoArquivo, 'Resultados de Desempenho - Amazon\n\n');
    });

    navegadores.forEach((navegador) => {
        context(`Testando no navegador: ${navegador}`, () => {
            before(() => {
                // Adiciona uma linha em branco no relatório antes de iniciar os testes para o próximo navegador
                cy.writeFile(resultadoArquivo, '\n', { flag: 'a+' });
            });

            it('Deve medir o tempo de carregamento da página inicial', () => {
                const url = 'https://www.amazon.com.br';

                cy.visit(url, {
                    onBeforeLoad: (win) => {
                        win.performance.mark('start-loading');
                    },
                    onLoad: (win) => {
                        win.performance.mark('end-loading');
                        win.performance.measure('page-load', 'start-loading', 'end-loading');
                    },
                });

                cy.window().then((win) => {
                    const measures = win.performance.getEntriesByName('page-load');
                    if (measures.length > 0) {
                        const loadTime = measures[0].duration;
                        const mensagem = `Navegador: ${navegador}\nTempo de carregamento da página: ${loadTime.toFixed(2)}ms\n`;
                        cy.log(mensagem);
                        cy.writeFile(resultadoArquivo, mensagem, { flag: 'a+' }); // Adiciona ao arquivo
                    } else {
                        const mensagem = `Navegador: ${navegador}\nNão foi possível medir o tempo de carregamento.\n`;
                        cy.log(mensagem);
                        cy.writeFile(resultadoArquivo, mensagem, { flag: 'a+' }); // Adiciona ao arquivo
                    }
                });
            });

            it('Deve verificar se os principais recursos foram carregados', () => {
                cy.visit('https://www.amazon.com.br');

                cy.window().then((win) => {
                    const resources = win.performance.getEntriesByType('resource');
                    const mensagemRecursos = `Navegador: ${navegador}\nNúmero de recursos carregados: ${resources.length}\n`;
                    cy.log(mensagemRecursos);
                    cy.writeFile(resultadoArquivo, mensagemRecursos, { flag: 'a+' }); // Adiciona ao arquivo
                });
            });
        });
    });
});