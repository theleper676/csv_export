const CSVToJSON = require('csvtojson');
const JSONToCSV = require('json2csv').parse;
const FileSystem = require('fs');
const unidecode = require('unidecode');

CSVToJSON().fromFile("./catalog_products.csv").then(source =>{ 
    var regex = /(<([^>]+)>)/ig;
    for(var i=0;i<source.length;i++){
        source[i].description = source[i].description.replace(regex, "");
        source[i].description = source[i].description.replace("\uABCD", "");
        //decode uti for invalid chaecters 
        source[i].collection = unidecode(source[i].collection);
     }
    
     const csv = JSONToCSV(source,{quote: ''} );
     FileSystem.writeFileSync("./csv_output.csv", csv);
    }
    )