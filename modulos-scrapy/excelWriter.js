const ExcelJS = require('exceljs');
const async = require('async');
const scrapeEntry = require('./scraperNode');

const fs = require('fs');
// Establecer la codificación al leer el archivo
const people = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

function excelWriter(inputName) {
    async.mapSeries(Object.keys(people), scrapeEntry, function (err, results) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Define an array of column headers
        const columnHeaders = [
            { header: 'Name', key: 'name' },
            { header: 'URL', key: 'url' },
            { header: 'Photo', key: 'photo' },
            { header: 'Affiliation', key: 'affiliation' },
            { header: 'Keywords', key: 'keywords' },
            { header: 'Citations - All time', key: 'citationsAllTime' },
            { header: 'Citations - Since 2018', key: 'citationsSince2018' },
            { header: 'H-Index - All time', key: 'hindexAllTime' },
            { header: 'H-Index - Since 2018', key: 'hindexSince2018' },
            { header: 'I10-Index - All time', key: 'i10indexAllTime' },
            { header: 'I10-Index - Since 2018', key: 'i10indexSince2018' },
            { header: 'Year', key: 'year' },
            /*
            { header: 'Citations - 2023', key: 'citations2023' },
            { header: 'Citations - 2022', key: 'citations2022' },
            { header: 'Citations - 2021', key: 'citations2021' },
            { header: 'Citations - 2020', key: 'citations2020' },
            { header: 'Citations - 2019', key: 'citations2019' },
            { header: 'Citations - 2018', key: 'citations2018' },
            */

        ];

        // Add the collaborator headers to the column headers array
        for (let i = 1; i <= 10; i++) {
            columnHeaders.push({ header: `Collaborator ${i}`, key: `collaborator${i}` });
        }

        // Add the 20 articles  to the column headers array
        for (let i = 1; i <= 20; i++) {
            columnHeaders.push(
                { header: `titleArticle ${i}`, key: `titleArticle${i}` },
                { header: `authorsArticle ${i}`, key: `authorsArticle${i}` },
                { header: `yearArticle ${i}`, key: `yearArticle${i}` },
                { header: `citationsArticle ${i}`, key: `citationsArticle${i}` });

        }

        // Agregar encabezados de columna
        worksheet.columns = columnHeaders;

        // Agregar datos
        results.forEach(function (result) {
            const collaboratorData = {};
            for (let i = 1; i <= 10; i++) {
                collaboratorData[`collaborator${i}`] = result.collaborators[i - 1] || '';
            }

            //console.log("🚀 ~ file: excelWriter.js:60 ~ collaboratorData", collaboratorData)
            const topArticlesData = {};

            for (let i = 1; i <= 20; i++) {
                const article = result.topArticles[i - 1] || {};
                topArticlesData[`titleArticle${i}`] = article.title || '';
                topArticlesData[`authorsArticle${i}`] = article.authors || '';
                topArticlesData[`yearArticle${i}`] = article.year || '';
                topArticlesData[`citationsArticle${i}`] = article.citations || '';
            }
            //console.log("🚀 ~ file: excelWriter.js:73 ~ topArticlesData", topArticlesData)
            worksheet.addRow({
                name: result.name,
                url: result.url,
                photo: result.photo,
                affiliation: result.affiliation,
                keywords: result.keywords.join(', '),
                citationsAllTime: result.stats.citations[0],
                citationsSince2018: result.stats.citations[1],
                hindexAllTime: result.stats.hindex[0],
                hindexSince2018: result.stats.hindex[1],
                i10indexAllTime: result.stats.i10index[0],
                i10indexSince2018: result.stats.i10index[1],
                year: result.year,

                ...collaboratorData,
                ...topArticlesData,

            });
        });
        const outputFileExcel = `stats-${inputName}`;
        // Guardar el archivo Excel
        workbook.xlsx.writeFile(`${outputFileExcel}.xlsx`)
            .then(function () {
                console.log('File saved! as ' + outputFileExcel + '.xlsx');
            });
    });
}
module.exports = excelWriter;