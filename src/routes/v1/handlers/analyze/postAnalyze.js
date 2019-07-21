const fs = require('fs');
const path = require('path');
const os = require('os');
const admZip = require('adm-zip');
const _ = require('lodash');
const parser = require('./parser');
const prefixToAnalyze = ['.js', '.jsx']

const getAssetsDir = () => path.join(os.homedir(), 'devl', 'code', 'faaster', 'assets');

const getEntryDir = (zipEntry, zipName) => {
    const fullPath = zipEntry.rawEntryName.toString();
    const relative = fullPath.substring(zipName.length);
    return relative.replace(zipEntry.name, "");
}

const extractZipName = zipFile => {
    const zipName = zipFile.split('/').pop();
    const suffixLoc = _.lastIndexOf(zipName, '.');
    return suffixLoc > 0 ? zipName.substring(0, suffixLoc) : zipName;
}

const exportZipContent = zipFilePath => {
    const mapping = [];
    const zip = new admZip(zipFilePath);
    const zipName = extractZipName(zipFilePath);
    var zipEntries = zip.getEntries(); // an array of ZipEntry records
    zipEntries.map(f => (!f.isDirectory &&
        mapping.push({
            name: f.name,
            content: f.getData().toString('utf8'),
            relativePath: getEntryDir(f, zipName)
        })
    ));
    return mapping;
}


const getAssetsDirContent = async dir => {
    const mapping = {};
    const zipArchives = fs.readdirSync(dir).map(f => path.join(dir, f))

    zipArchives.map(archivePath => {
        mapping[archivePath] = exportZipContent(archivePath);
    })
    return mapping;
}

const shouldAnalyzeFile = f => {
    return prefixToAnalyze.includes(path.extname(f.name).toLowerCase())
}

const analyzeFile = f => {
    if (!shouldAnalyzeFile(f)) {
        console.log(`skipping file : ${f.name}`)
        return;
    }
    console.log(`analyzing file ${f.name}...`)
    parser.parse(f.content)
}





const postAnalyze = async ctx => {
    const zipContent = await getAssetsDirContent(getAssetsDir())
    _.map(zipContent, (repo, repoPath) => {
        console.log(`analyzing repo ${repoPath}...`)
        repo.map(f => analyzeFile(f))
    })
    ctx.body = {
        'status': "registered"
    }
}

module.exports = postAnalyze;