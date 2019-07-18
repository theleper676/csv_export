const CSVToJSON = require('csvtojson');
const FileSystem = require('fs');
const unidecode = require('unidecode');
const stripHtml = require("string-strip-html");
const papaparse = require('papaparse');



//CSVToJSON().fromFile("./catalog_products.csv").then

CSVToJSON({delimiter:'auto'}).fromFile("./catalog_products.csv").then(source => {

    source.forEach(sourceJson => {

            if(sourceJson.handleId.length == 0){
                console.log('HnadleId is null');
                return;
            }
            else if(sourceJson.fieldType.length == 0){
                console.log('fieldType is null');
                return;
            }

            StripHtml(sourceJson);
            Unidecode(sourceJson);
            DeleteHandleIDQuotes(sourceJson);
            URIencoding(sourceJson);
        
        sourceJson.fieldType = sourceJson.fieldType.replace(/\"/g, "");
    });

    //Stip any HTML tags from description 
    function StripHtml (sourceJson){
        sourceJson.description = stripHtml(sourceJson.description);
    }

    //Unidcode Description and name
    function Unidecode (sourceJson){
        sourceJson.description = unidecode(sourceJson.description);
       //sourceJson.name = unidecode(sourceJson.name);
        sourceJson.collection = unidecode(sourceJson.collection);
        sourceJson.additionalInfoTitle1 = unidecode(sourceJson.additionalInfoTitle1);
        sourceJson.additionalInfoDescription1 = unidecode(sourceJson.additionalInfoDescription1);
    };
    //Delete Handle ID Quotes
    function DeleteHandleIDQuotes (sourceJson){
        sourceJson.handleId = sourceJson.handleId.replace(/\"/g, "");
    };

    function URIencoding (sourceJson){
        sourceJson.productImageUrl = encodeURI(sourceJson.productImageUrl);
    };

    const csv = papaparse.unparse(source,{escapeChar: '"',quotes:false,quoteChar: '"'});
    FileSystem.writeFileSync("./csv_output.csv", csv);
}
)
