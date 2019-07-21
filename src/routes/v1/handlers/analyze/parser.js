const {
    Parser
} = require('acorn');
const walk = require('acorn-walk');
const parse = content => {
    getFileAST(content)
}



const searchFramework = ast => {
    walk.simple(ast[0]), {
        [walk.base.Literal]: (node) => {
            console.log('aaa')
        }
    }
    console.log('aaa')
}


const getFileAST = entry => {
    const parsed = Parser.parse(entry);
    searchFramework(parsed.body)
    console.log('aaa')
}


module.exports = {
    parse,
}