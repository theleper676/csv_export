const CSVToJSON = require('csvtojson');
const unidecode = require('unidecode');
const stripHtml = require("string-strip-html");
const papaparse = require('papaparse');


const StripHtml = sourceJson => Object.assign(sourceJson, {
    description: stripHtml(sourceJson.description)
});

//Unidcode Description and name
const Unidecode = sourceJson => ({
    ...sourceJson,
    description: unidecode(sourceJson.description),
    collection: unidecode(sourceJson.collection),
    additionalInfoTitle1: unidecode(sourceJson.additionalInfoTitle1),
    additionalInfoDescription1: unidecode(sourceJson.additionalInfoDescription1)
})

const CheckHandleId = sourceJson =>{
    if (sourceJson.handleId == 0){
        console.log(sourceJson.name + ' is null')
    }
    if(sourceJson.fieldType != 'Product' || 'Variant'){
        console.log(sourceJson.name + ' is not a valid Product or Variant')
    }
}


//Delete Handle ID Quotes
const DeleteHandleIDQuotes = sourceJson => ({
    ...sourceJson,
    handleId: sourceJson.handleId.replace(/\"/g, "")
})

//check if image url has undecoded spaces and decode back. 

const CheckIfIncludesSpaces = sourceJson => Object.assign(sourceJson,{
    productImageUrl: encodeURI(sourceJson.productImageUrl)
})

const toCsv = sourceJson =>
    papaparse.unparse(sourceJson, {
        escapeChar: '"',
        quotes: false,
        quoteChar: '"'
    });

const mapping = {
    stripHtml: StripHtml,
    unidecode: Unidecode,
    deleteHandleIdQuotes: DeleteHandleIDQuotes,
    checkIncludeBlankSpacesForUrl: CheckIfIncludesSpaces,
    CheckHandleId: CheckHandleId
}


const parseCSV = async ctx => {
    const payload = ctx.request.body;
    const input = ctx.request.files.file;
    let sourceJson = await CSVToJSON({
        delimiter: 'auto'
    }).fromFile(input.path)
    Object.keys(payload).map(f => sourceJson.map(r => mapping[f](r)))
    ctx.set('Content-disposition', `attachment; filename=output.csv`);
    ctx.statusCode = 200;
    ctx.body = Buffer.from(toCsv(sourceJson));
}

module.exports = parseCSV;