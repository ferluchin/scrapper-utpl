Google Scholar
===============

Este scraper fue desarrollado para obtener las estadísticas de citas de los perfiles de los investigadores en [Google Scholar](http://scholar.google.com/), implementando node.js [node.js](http://nodejs.org/). El proyecto comenzó con una lista de investigadores de la Universidad y su enlace correspondiente a google scholar.

Los datos resultantes se exportan en formato Excel y se importan a la herramienta de visualización de datos Power BI para su análisis y visualización.

**Nota editorial**: 

Esta lista sólo contiene investigadores que tienen un perfil en Google Scholar; 

USO DE LA HERRAMIENTA GOOGLE SCHOLAR SCRAPER
---------------------

Se requiere [node.js](http://nodejs.org/) instalado, 

Para instalar los paquetes requeridos para el scraper, ejecute:

    $ npm install request cheerio async path exceljs google-scholar

Para ejecutar el scraper, utilice el siguiente comando:

	$ node scrape.js ./people-hci.json

Al ejecutar scrape.js, el archivo people-hci.json se leerá. Este archivo contiene los registros de los docentes en formato JSON, como se muestra a continuación:



```json
{
  "Carlos Ivan Espinosa": "https://scholar.google.com/citations?hl=en&user=LU8X844AAAAJ",
}
```

y procedera a obtener las estadísticas de citas y datos relevantes de cada uno de los investigadores.
posteriormente lo almacenaran en un archivo excel. en este caso stats-hci.xlsx 

Este documento excel se importara a la herramienta de visualización de datos Power BI para su análisis y visualización.


```bash
$ node scrape.js ./people-hci.json > stats-hci.js
```


Para realizar scrapping de las imagenes de los investigadores, se ejecuta el siguiente comando:

```bash
$ node download-images.js ./stats-hci.js
```

Iniciamos el servidor web para visualizar las estadísticas en un navegador web;
A continuación, abra `index.html` y se visualizaran las nuevas estadísticas.


###End


