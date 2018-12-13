'use strict';
const util = require('util');
//var isUpperCase = require('is-upper-case')

/**
 * only returns true when the input is all Upper case characters.
 * @param {} input 
 */
function isUpperCase(input) {
    return /^[A-Z]*$/.test(input);
}

function isLowerCase(input) {
    return /^[a-z]*$/.test(input);
}

function isAlphaNumeric(input) {
    return /^[a-zA-Z0-9]*$/.test(input);
}


/**
 * the sql query for columns in a table.
 * @param {} schema 
 * @param {*} name 
 */
function queryForColumns(schema, name) {
    return `select * from information_schema.columns where table_schema = \'${schema}\' and table_name=\'${name}\'`;
}

/**
 * 
 * generating script for insersion procedure.
 * needs to identify identity column and remove from insersion.
 * @param {*} columns 
 */
function generateInsertScript(columns) {
    if (!util.isArray(columns)) {
        throw new Error('the input for generate script must have be an Array');

    }
    if (columns.lenght === 0) {
        throw new Error('the input for generate script must have be an Array with at least one element');
    }
    const schema = columns[0].TABLE_SCHEMA;
    const name = columns[0].TABLE_NAME;
    var declareVariable = columns.map(column => {
        var va = '@' + column.COLUMN_NAME + ' ' + column.DATA_TYPE;
        var typeappend;
        switch (column.DATA_TYPE) {
            case 'varchar':
                typeappend = `(${column.CHARACTER_MAXIMUM_LENGTH})`;
                break;
            default:
                typeappend = '';
        }
        var finalVa = va + typeappend;
        if (column.COLUMN_DEFAULT) {
            finalVa = finalVa + ' = ' + column.COLUMN_DEFAULT;
        } else if (column.IS_NULLABLE === 'YES') {
            finalVa = finalVa + ' = NULL'; // added NULL as default
        }
        return finalVa;

    }
    ).join(',\n\t');

    var insertColumns = columns.map(column => '[' + column.COLUMN_NAME + ']').join(',\n\t');

    var values = columns.map(column => '@' + column.COLUMN_NAME).join(',\n\t');

    var script =
        `CREATE PROCEDURE ${schema}.insert${name} 
    ${declareVariable}
AS
BEGIN
INSERT INTO ${schema}.${name}
    (
    ${insertColumns}   )
VALUES
    (
    ${values});
END`;
    return script;
}

/**
 * needs a way to determine key.
 * right now using non-null columns.
 * @param {*} columns 
 */
function generateUpdateScript(columns) {
    if (!util.isArray(columns)) {
        throw new Error('the input for generate script must have be an Array');

    }
    if (columns.lenght === 0) {
        throw new Error('the input for generate script must have be an Array with at least one element');
    }
    const schema = columns[0].TABLE_SCHEMA;
    const name = columns[0].TABLE_NAME;

    var declareVariable = columns.map(column => {
        var va = '@' + column.COLUMN_NAME + ' ' + column.DATA_TYPE;
        var typeappend;
        switch (column.DATA_TYPE) {
            case 'varchar':
                typeappend = `(${column.CHARACTER_MAXIMUM_LENGTH})`;
                break;
            default:
                typeappend = '';
        }
        var finalVa = va + typeappend;
        if (column.COLUMN_DEFAULT) {
            finalVa = finalVa + ' = ' + column.COLUMN_DEFAULT;
        } else if (column.IS_NULLABLE === 'YES') {
            finalVa = finalVa + ' = NULL'; // added NULL as default
        }
        return finalVa;

    }
    ).join(',\n\t');

    var setColumns = columns.map(column => `[${column.COLUMN_NAME}] = CASE WHEN @${column.COLUMN_NAME} IS NULL THEN ${column.COLUMN_NAME} ELSE @${column.COLUMN_NAME} END`).join(',\n\t');

    var whereCondition = columns.filter(column => { return column.IS_NULLABLE === 'NO'; })
        .map(column => column.COLUMN_NAME + '= @' + column.COLUMN_NAME).join('\n\tAND\n\t');

    var script =
        `CREATE PROCEDURE admin.update${capitalOne(name)} 
    ${declareVariable}
AS
BEGIN
UPDATE ${schema}.${name} 
SET
    ${setColumns}   
WHERE
    ${whereCondition};

END`;
    return script;
}

function capitalOne(word) {
    if (!word || word.length === 0) return word;
    return word[0].toUpperCase() + word.substring(1);
}


/* the promise way of writing code.
pool.connect().then(
    con => {
        const request = new sql.Request(pool);
        request.query(queryForColumns(env.schema, env.name)).then(
            result => {

                const script = generateUpdateScript(result.recordset);
                console.log(script);
            },
            err => console.log(err)
        )
    }
)
*/

/**
 * the input is database name
 * generally capitalized
 * TestID => testId
 * TESTid=> testId
 * testid=> testid 
 * 
 * @param {} name 
 */
function getFrontEndName(name) {
    if (!name || name.length === 1) return name;
    // replace ID with Id
    name = name.replace('ID', 'Id');
    if (isUpperCase(name.substring(0, 1)) && !isUpperCase(name.substring(1, 2))) {
        return name.substring(0, 1).toLowerCase() + name.substring(1);
    } else if (!isUpperCase(name.substring(0, 1))) {
        return name;
    } else {
        var i = 1;
        while (i + 1 <= name.length && isUpperCase(name.substring(0, i + 1))) {
            i++;
        }
        if (i === name.length) return name.toLowerCase();
        else {
            const result = name.substring(0, i).toLowerCase() + name.substring(i, i + 1).toUpperCase() + name.substring(i + 1);
            return result;
        };
    }
}

function generateArgList(columns) {
    return columns.map(column => {
        return ` { 
        tag: '${column.COLUMN_NAME}',
        json: '${getFrontEndName(column.COLUMN_NAME)}',
        required: ${required(column)},
        argtype: {type: '${column.DATA_TYPE}'${typeAppend(column)}},
        notAWildcardMatch: 1
    } `

    }).join(',\n\t')
}

function required(column) {
    if ((column.IS_NULLABLE === 'NO') && !column.COLUMN_DEFAULT) return 1;
    else return 0;
}
function typeAppend(column) {
    var typeappend;
    switch (column.DATA_TYPE) {
        case 'varchar':
            typeappend = `, length: ${column.CHARACTER_MAXIMUM_LENGTH}`;
            break;
        default:
            typeappend = '';
    }
    return typeappend;
}


exports.getFrontEndName = getFrontEndName;
exports.generateArgList = generateArgList;
exports.generateUpdateScript = generateUpdateScript;
exports.generateInsertScript = generateInsertScript;
exports.queryForColumns = queryForColumns;
exports.isUpperCase = isUpperCase;
exports.isLowerCase = isLowerCase;
exports.isAlphaNumeric= isAlphaNumeric;