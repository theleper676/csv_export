const CSVToJSON = require('csvtojson');
const JSONToCSV = require('json2csv').parse;
const FileSystem = require('fs');
const unidecode = require('unidecode');
const stripHtml = require("string-strip-html");
const papaparse = require('papaparse');



CSVToJSON().fromFile("./catalog_products.csv").then(source => {

    source.forEach(sourceJson => {

        sourceJson.description = stripHtml(sourceJson.description);
        //sourceJson.description = JSON.stringify(sourceJson.description);
        sourceJson.description = unidecode(sourceJson.description);
        sourceJson.handleId = sourceJson.handleId.replace(/\"/g, "");
        sourceJson.fieldType = sourceJson.fieldType.replace(/\"/g, "");

        

    });
    //const csv = JSONToCSV(source);
    const csv = papaparse.unparse(source,{escapeChar: '"',quotes:false,quoteChar: '"'});
    FileSystem.writeFileSync("./csv_output.csv", csv);
}
)
