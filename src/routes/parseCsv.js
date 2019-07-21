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


//Delete Handle ID Quotes
const DeleteHandleIDQuotes = sourceJson => ({
    ...sourceJson,
    handleId: sourceJson.handleId.replace(/\"/g, "")
})

//check if image url has undecoded spaces and decode back. 
const CheckIfIncludesSpaces = sourceJson => {
    let sourceJson2 = {
        ...sourceJson
    };
    if (sourceJson.productImageUrl.includes('%20')) {
        console.log(sourceJson.name + ' Has uncoded image space');
        Object.assign(sourceJson2, {
            productImageUrl: encodeURI(sourceJson.productImageUrl)
        })
    }
    return sourceJson2;
}

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
    checkIncludeBlankSpacesForUrl: CheckIfIncludesSpaces
}


const parseCSV = async ctx => {
    const payload = ctx.request.body;
    let sourceJson = await CSVToJSON({
        delimiter: 'auto'
    }).fromFile("./catalog_products.csv")
    payload.map(f => sourceJson.map(r => mapping[f](r)))
    ctx.set('Content-disposition', `attachment; filename=output.csv`);
    ctx.statusCode = 200;
    ctx.body = Buffer.from(toCsv(sourceJson));
}

module.exports = parseCSV;