const CSVToJSON = require('csvtojson');
const FileSystem = require('fs');
const unidecode = require('unidecode');
const stripHtml = require("string-strip-html");
const papaparse = require('papaparse');


CSVToJSON({ delimiter: 'auto' }).fromFile("./catalog_products.csv").then(source => {

    source.forEach(sourceJson => {

        CheckIfIncludesSpaces(sourceJson);

        if (sourceJson.handleId.length == 0) {
            console.log('HnadleId is null');
            return;
        }
        else if (sourceJson.fieldType.length == 0) {
            console.log('fieldType is null');
            return;
        }

        StripHtml(sourceJson);
        Unidecode(sourceJson);
        DeleteHandleIDQuotes(sourceJson);

        sourceJson.fieldType = sourceJson.fieldType.replace(/\"/g, "");
    });

    //Stip any HTML tags from description 
    function StripHtml(sourceJson) {
        sourceJson.description = stripHtml(sourceJson.description);
    }

    //Unidcode Description and name
    function Unidecode(sourceJson) {
        sourceJson.description = unidecode(sourceJson.description);
        sourceJson.collection = unidecode(sourceJson.collection);
        sourceJson.additionalInfoTitle1 = unidecode(sourceJson.additionalInfoTitle1);
        sourceJson.additionalInfoDescription1 = unidecode(sourceJson.additionalInfoDescription1)
    };
    //Delete Handle ID Quotes
    function DeleteHandleIDQuotes(sourceJson) {
        sourceJson.handleId = sourceJson.handleId.replace(/\"/g, "");
    };

    //check if image url has undecoded spaces and decode back. 
    function CheckIfIncludesSpaces(sourceJson) {
        if (sourceJson.productImageUrl.includes('%20')) {
            console.log(sourceJson.name + ' Has uncoded image space');
            sourceJson.productImageUrl = encodeURI(sourceJson.productImageUrl);
        }
    }

    const csv = papaparse.unparse(source, { escapeChar: '"', quotes: false, quoteChar: '"' });
    FileSystem.writeFileSync("./csv_output.csv", csv);
}
)
