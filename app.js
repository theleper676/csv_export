const CSVToJSON = require('csvtojson');
const JSONToCSV = require('json2csv').parse;
const FileSystem = require('fs');
const unidecode = require('unidecode');
const striptags = require('striptags');

CSVToJSON().fromFile("./catalog_products.csv").then(source =>{ 
    var regex = /(<([^>]+)>)/ig;
    for(var i=0;i<source.length;i++){
        source[i].description = source[i].description.replace(regex, "");
        source[i].description = source[i].description.replace("\uABCD", "");
        //remove html tags from additional Info decription 1
        source[i].additionalInfoDescription1 = striptags(source[i].additionalInfoDescription1);

        //decode uti for invalid chaecters 
        source[i].collection = unidecode(source[i].collection);
     }

     var productDescription3 = source[0].productOptionDescription3;
     var splitProductDescrption = productDescription3.split(';');
     console.log(splitProductDescrption.length);
     if(splitProductDescrption.length >=30){
         splitProductDescrption.length - 1;
         console.log(splitProductDescrption.length);
     }

     var jsonData = JSON.stringify(source);
     FileSystem.writeFile('./json_output.json',jsonData, function(err){
         if(err){
             console.log(err);
         }
     }
     
     
     );
     const csv = JSONToCSV(source);
     FileSystem.writeFileSync("./csv_output.csv", csv);
    }
    )