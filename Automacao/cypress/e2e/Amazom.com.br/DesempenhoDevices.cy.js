// Ajuda o VSCode a entender o que é o arquivo e a fornecer recursos de autocompletar
/// <reference types="cypress" />
/// <reference types="cypress-xpath" />
require('cypress-xpath');
import 'cypress-xpath';

describe('Teste de Desempenho em Dispositivos - Amazon', () => {
    // Gera um nome único para o arquivo de relatório com base no timestamp formatado
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0'); // Dia com 2 dígitos
    const mes = String(now.getMonth() + 1).padStart(2, '0'); // Mês com 2 dígitos
    const ano = String(now.getFullYear()).slice(2); // Últimos 2 dígitos do ano
    const hora = String(now.getHours()).padStart(2, '0'); // Hora com 2 dígitos
    const minuto = String(now.getMinutes()).padStart(2, '0'); // Minuto com 2 dígitos
    const timestamp = `${dia}${mes}${ano}_${hora}${minuto}`; // Formato ddmmaa_hhmm
    const resultadoArquivo = `cypress/results/desempenhoDevices_resultados_${timestamp}.txt`; // Caminho do arquivo para salvar os resultados

    const dispositivos = [
        { device: 'iPhone X', width: 375, height: 812 },
        { device: 'iPad', width: 768, height: 1024 },
        { device: 'Desktop', width: 1920, height: 1080 },
    ];

    const resultados = []; // Array para armazenar os resultados de cada dispositivo

    dispositivos.forEach((dispositivo, index) => {
        it(`Deve medir o tempo de carregamento no dispositivo: ${dispositivo.device}`, () => {
            cy.viewport(dispositivo.width, dispositivo.height); // Define a resolução do dispositivo
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
                    const loadTime = measures[0].duration.toFixed(2);
                    resultados.push({ device: dispositivo.device, loadTime }); // Armazena o resultado
                    cy.log(`Dispositivo: ${dispositivo.device}, Tempo de carregamento: ${loadTime}ms`);
                } else {
                    resultados.push({ device: dispositivo.device, loadTime: 'Não foi possível medir' });
                    cy.log(`Dispositivo: ${dispositivo.device}, Não foi possível medir o tempo de carregamento.`);
                }

                // Gera o relatório após o último dispositivo
                if (index === dispositivos.length - 1) {
                    // Formata o conteúdo do relatório
                    const reportContent = resultados.map(
                        (resultado) => `Dispositivo: ${resultado.device}, Tempo de carregamento: ${resultado.loadTime}ms`
                    ).join('\n');

                    // Salva o relatório no arquivo usando cy.writeFile
                    cy.writeFile(resultadoArquivo, reportContent);

                    // Loga a mensagem de sucesso
                    cy.log(`Relatório salvo no arquivo: ${resultadoArquivo}`);
                }
            });
        });
    });
});
