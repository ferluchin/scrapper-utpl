// La función "scrapePublications" extrae las 20 publicaciones más citadas del investigador en Google Scholar.
var scrapePublications = function (person, doneCallback) {
    var url = people[person];
    var data = {};

    // Se utiliza la biblioteca "google-scholar" para realizar la búsqueda de las publicaciones.
    scholar.search(person, { sort: 'cited' }, function (err, results) {
        if (err) {
            console.error("Error scraping publications for " + person + ": " + err);
            doneCallback();
            return;
        }

        // Se imprime un mensaje en la consola para indicar que se están raspando las publicaciones.
        console.error("Scraping publications for " + person + "...");

        // Se crea un archivo de Excel y se agrega una hoja con el nombre del investigador.
        var workbook = new ExcelJS.Workbook();
        var sheet = workbook.addWorksheet(person);

        // Se agregan los encabezados de las columnas.
        sheet.addRow(['Title', 'Cited By', 'Year', 'Authors']);

        // Se itera sobre las 20 publicaciones más citadas.
        for (var i = 0; i < Math.min(20, results.length); i++) {
            var result = results[i];

            // Se extraen los datos relevantes de la publicación.
            var title = result.title;
            var citedBy = result.citedCount;
            var year = result.year;
            var authors = result.authors.join('; ');

            // Se agrega la fila a la hoja de Excel.
            sheet.addRow([title, citedBy, year, authors]);
        }

        // Se guarda el archivo de Excel.
        var filename = `publications-${person}.xlsx`;
        workbook.xlsx.writeFile(filename).then(function () {
            console.log(`File saved: ${filename}`);
            doneCallback();
        });
    });
};

// Se utiliza la biblioteca "async" para realizar la extracción de datos de manera asíncrona.
async.eachSeries(Object.keys(people), function (person, callback) {
    async.series([
        function (callback) {
            scrapeEntry(person, callback);
        },
        function (callback) {
            scrapePublications(person, callback);
        }
    ], callback);
}, function (err) {
    console.log("Done!");
});