// From http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
// Se importan los módulos necesarios para el script.
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
const path = require('path');
//agregado
const ExcelJS = require('exceljs');
const scholar = require('google-scholar');

const inputFile = process.argv[2];
const inputName = path.basename(inputFile, path.extname(inputFile)).replace('people-', '');
const outputFile = `stats-${inputName}.js`;
console.log(`outputFile: ${outputFile}`);

const scrapeEntry = require('./modulos-scrapy/scraperNode');
// const excelWriter = require('./modulos-scrapy/excelWriter');


const fs = require('fs');
// Establecer la codificación al leer el archivo
const people = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));


const iconv = require('iconv-lite');
// http://javascriptplayground.com/blog/2013/06/think-async/

/*
async.mapSeries(Object.keys(people), scrapeEntry, function (err, results) {
  var date = new Date();
  var data = 'var date = "' + date + '";\nvar data = ' + JSON.stringify(results, null, 2) + ';\n';
  fs.writeFileSync(outputFile, iconv.encode(data, 'utf8'), { encoding: 'binary' });
});
*/

const excelWriter = require('./modulos-scrapy/excelWriter');

excelWriter(inputName)
