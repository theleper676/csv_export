const CSVToJSON = require('csvtojson');
const JSONToCSV = require('json2csv').parse;
const FileSystem = require('fs');
const unidecode = require('unidecode');
const stripHtml = require("string-strip-html");
const papaparse = require('papaparse');



//CSVToJSON().fromFile("./catalog_products.csv").then

CSVToJSON().fromFile("./catalog_products.csv").then(source => {

    source.forEach(sourceJson => {

            StripHtml(sourceJson);
            Unidecode(sourceJson);
            DeleteHandleIDQuotes(sourceJson);
        
        sourceJson.fieldType = sourceJson.fieldType.replace(/\"/g, "");
    });

    //Stip any HTML tags from description 
    function StripHtml (sourceJson){
        sourceJson.description = stripHtml(sourceJson.description);
    }

    //Unidcode Description 
    function Unidecode (sourceJson){
        sourceJson.description = unidecode(sourceJson.description);
    };
    //Delete Handle ID Quotes
    function DeleteHandleIDQuotes (sourceJson){
        sourceJson.handleId = sourceJson.handleId.replace(/\"/g, "");
    };

    const csv = papaparse.unparse(source,{escapeChar: '"',quotes:false,quoteChar: '"'});
    FileSystem.writeFileSync("./csv_output.csv", csv);
}
)
