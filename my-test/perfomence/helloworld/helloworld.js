// const autocannon = require('autocannon')
const run = require('../../../lib/run')
const { HOST, PORT } = require('../../key')

const url = `http://${HOST}:${PORT}/`
const path = '/api/test/no-auth'

run({
  url: url,
  connections: 20,
  duration: 60,
  pipelining: 500,
  requests: [
    {
      method: 'GET',
      path: path
    }
  ]
}, finishedBench)

function finishedBench (err, res) {
  // console.log('over');
  console.log('finished bench', err, res)
}
