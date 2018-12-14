#!/usr/bin/env node
'use strict';

const sql = require('mssql');
const env = require('dotenv').config().parsed;
const config = require('../config.json');
const lib = require('../lib');
const fs = require('fs');
const configDetail = {
    options: {
        encrypt: true
    },
    useUTC: false,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}
async function main() {
    const pool = new sql.ConnectionPool(Object.assign(config, configDetail));
    await pool.connect()
        .catch(err => {
            console.log(err);
        });
    const request = new sql.Request(pool);
    const result = await request
        .query(lib.queryForColumns(env.schema, env.name))
        .catch(err => {
            console.log(err);
        });
    const script = lib.generateUpdateScript(result.recordset);
    console.log(script);
    fs.writeFile('../output.txt', script, 'utf-8', (err) => {
        if(err) console.log(err);
        console.log("writing file done!");
        pool.close();
    }); // do not have a promise version.

}
main().catch(err => console.log(err));
