const { Client } = require('pg')
const ConnectionUtils = require('./utils/ConnectionUtils')

let client = null

const config = async(config) => {
  client = new Client(config)
}

const open = async (config) => {
  client.connect()
}

const beginTransaction = async () => {
  await client.query('begin;')
}

const commit = async () => {
  await client.query('commit;')
}

const rollback = async () => {
  await client.query('rollback;')
}

const query = async (string, params, options) => {
  let ret = await client.query(string, params)
  return ret.rows.map(ConnectionUtils.toCamelCase)
                 .map(row => ConnectionUtils.arrangeObject(row, options))
}

const close = async () => {
  await client.end()
}

module.exports = {
  config,
  open,
  beginTransaction,
  commit,
  rollback,
  query,
  close
}
