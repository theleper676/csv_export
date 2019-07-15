const CSVToJSON = require('csvtojson');
const JSONToCSV = require('json2csv').parse;
const FileSystem = require('fs');
const unidecode = require('unidecode');
const stripHtml = require("string-strip-html");


CSVToJSON().fromFile("./catalog_products.csv").then(source => {

    source.forEach(sourceJson => {

        sourceJson.description = stripHtml(sourceJson.description);
        sourceJson.description = JSON.stringify(sourceJson.description);
        sourceJson.description = unidecode(sourceJson.description);


    });
    const csv = JSONToCSV(source,);
    FileSystem.writeFileSync("./csv_output.csv", csv);
}
)
