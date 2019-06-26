const CSVToJSON = require('csvtojson');
const JSONToCSV = require('json2csv').parse;
const FileSystem = require('fs');
const utf8 = require('utf8');

CSVToJSON().fromFile("./catalog_products.csv").then(source =>{ 
    //const csv = JSONToCSV(source,{fields: ["sku","title","hardware","price"]});
    //FileSystem.writeFileSync("./destination.csv", csv);
    var regex = /(<([^>]+)>)/ig;
    for(var i=0;i<source.length;i++){
        source[i].description = source[i].description.replace(regex, "");
        source[i].description = source[i].description.replace("\uABCD", "");
     }
     console.log(source);
     const csv = JSONToCSV(source);
     FileSystem.writeFileSync("./csv_output.csv", csv);
    }
    )