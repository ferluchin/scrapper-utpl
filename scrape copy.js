// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
// Se importan los módulos necesarios para el script.
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
const path = require('path');
//agregado
const ExcelJS = require('exceljs');

const inputFile = process.argv[2];
const inputName = path.basename(inputFile, path.extname(inputFile)).replace('people-', '');
const outputFile = `stats-${inputName}.js`;
console.log(`outputFile: ${outputFile}`);

const fs = require('fs');
// Establecer la codificación al leer el archivo
const people = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

// Se toma un archivo de entrada que contiene una lista de URLs de perfil de Google Scholar.
// var people = require(process.argv[2]);

// La función "scrapeEntry" extrae información del perfil de un investigador dado en Google Scholar.
var scrapeEntry = function (person, doneCallback) {
  var url = people[person];
  var data = {};

  // Se realiza una solicitud GET para obtener el HTML del perfil del investigador.
  // Se utiliza la biblioteca "request" para realizar la solicitud.
  request({ encoding: 'utf8', method: "GET", uri: url }, function (err, resp, body) {

    // Se utiliza la biblioteca "cheerio" para analizar el HTML y extraer la información necesaria del perfil.
    var $ = cheerio.load(body);

    try {
      // Se imprime un mensaje en la consola para indicar que se está realizando el raspado.
      console.error("Scraping " + person + "...");

      // Se extraen la foto y la afiliación del investigador.
      var photo = $('#gsc_prf_pup-img')[0].attribs.src;
      var affiliation = $('.gsc_prf_il', '#gsc_prf_i').first().text();

      // Se extraen las palabras clave del investigador.
      var keywords_root = $('#gsc_prf_int')[0].children;
      var keywords = [];
      for (var i = 0; i < keywords_root.length; i++) {
        keywords.push(keywords_root[i].children[0].data);
      }

      // Se extraen las estadísticas de citas del investigador.
      var rawStats = $('#gsc_rsb_st');
      var stats = {
        'citations': [rawStats[0].children[1].children[0].children[1].children[0].data,
        rawStats[0].children[1].children[0].children[2].children[0].data],
        'hindex': [rawStats[0].children[1].children[1].children[1].children[0].data,
        rawStats[0].children[1].children[1].children[2].children[0].data],
        'i10index': [rawStats[0].children[1].children[2].children[1].children[0].data,
        rawStats[0].children[1].children[2].children[2].children[0].data]
      };

      // Se extraen los colaboradores del investigador.
      var collaboratorEls = $('#gsc_rsb_co a');
      var collaborators = [];
      collaboratorEls.each(function (index, element) {
        collaborators.push($(element).text());
      });

      // Se extrae el año de la última publicación del investigador.
      var rawYear = $('.gsc_md_hist_b');

      // Se guarda toda la información extraída en un objeto de datos.
      data = {
        'name': person,
        'url': url,
        'photo': 'http://scholar.google.com' + photo,
        'affiliation': affiliation,
        'keywords': keywords,
        'stats': stats,
        'year': rawYear[0].children[0].children[0].data,
        'collaborators': collaborators
      };

      // Se llama a doneCallback para indicar que se ha terminado de extraer la información.
      //doneCallback(null, data);
    } catch (ex) {
      // Si se produce un error, se lanza una excepción y se detiene el scrap para el investigador actual.
      console.error(ex);
      throw new Error(person);
    }

    // Se utiliza un temporizador para controlar la velocidad de scrap.
    setTimeout(function () {
      doneCallback(null, data);
    }, 1000);
  });
};

const iconv = require('iconv-lite');
// http://javascriptplayground.com/blog/2013/06/think-async/

/*
async.mapSeries(Object.keys(people), scrapeEntry, function (err, results) {
  var date = new Date();
  var data = 'var date = "' + date + '";\nvar data = ' + JSON.stringify(results, null, 2) + ';\n';
  fs.writeFileSync(outputFile, iconv.encode(data, 'utf8'), { encoding: 'binary' });
});
*/

// Agregar esta informacion a excel // Crear un nuevo libro de Excel

async.mapSeries(Object.keys(people), scrapeEntry, function (err, results) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // Agregar encabezados de columna
  worksheet.columns = [
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
    { header: 'Collaborator 1', key: 'collaborator1' },
    { header: 'Collaborator 2', key: 'collaborator2' },
    { header: 'Collaborator 3', key: 'collaborator3' },
    { header: 'Collaborator 4', key: 'collaborator4' },
    { header: 'Collaborator 5', key: 'collaborator5' },
    { header: 'Collaborator 6', key: 'collaborator6' },
    { header: 'Collaborator 7', key: 'collaborator7' },
    { header: 'Collaborator 8', key: 'collaborator8' },
    { header: 'Collaborator 9', key: 'collaborator9' },
    { header: 'Collaborator 10', key: 'collaborator10' }
  ];

  // Agregar datos
  results.forEach(function (result) {
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
      collaborator1: result.collaborators[0],
      collaborator2: result.collaborators[1],
      collaborator3: result.collaborators[2],
      collaborator4: result.collaborators[3],
      collaborator5: result.collaborators[4],
      collaborator6: result.collaborators[5],
      collaborator7: result.collaborators[6],
      collaborator8: result.collaborators[7],
      collaborator9: result.collaborators[8],
      collaborator10: result.collaborators[9]
    });
  });
  const outputFileExcel = `stats-${inputName}`;
  // Guardar el archivo Excel
  workbook.xlsx.writeFile(`${outputFileExcel}.xlsx`)
    .then(function () {
      console.log('File saved! as ' + outputFileExcel + '.xlsx');
    });
});