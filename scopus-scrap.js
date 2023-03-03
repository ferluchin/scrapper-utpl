const axios = require("axios");
const xlsx = require("xlsx");
const path = require("path");

// Set the API key and author ID
const apiKey = "5eb48df0bc4093df1bd926c3bfcba41d";
const authorId = "57197836159";

// Set the API URL and options
const apiUrl = `https://api.elsevier.com/content/author/author_id/${authorId}`;
const options = {
    headers: { "X-ELS-APIKey": apiKey },
    params: {
        view: "METRICS",
    },
};

// Make the API request
axios
    .get(apiUrl, options)
    .then((response) => {
        // Extract the author's name, affiliations, and subject areas from the API response
        const authorName = response.data.author - retrieval - response.preferred - name.given - name + " " + response.data.author - retrieval - response.preferred - name.surname;
        const affiliations = response.data.author - retrieval - response.affiliation - current
            .map((affiliation) => affiliation.affiliation - name)
            .join(", ");
        const subjectAreas = response.data.author - retrieval - response.subject - areas
            .map((subjectArea) => subjectArea.$)
            .join(", ");

        // Create an array with the author's data
        const data = [
            ["Author Name", authorName],
            ["Affiliations", affiliations],
            ["Subject Areas", subjectAreas],
        ];

        // Create a new workbook and add the data to a new worksheet
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.aoa_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Scopus Data");

        // Save the workbook to a file
        const filename = path.join(__dirname, "scopus_data.xlsx");
        xlsx.writeFile(wb, filename, (error) => {
            // Check for errors and log the result
            if (error) {
                console.log(`Error saving file: ${error}`);
            } else {
                console.log(`File saved successfully: ${filename}`);
            }
        });
    })
    .catch((error) => {
        console.log(`Error making request: ${error}`);
    });