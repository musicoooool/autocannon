// const autocannon = require('autocannon')
const run = require('../lib/run')

const url = 'http://localhost:3000/'
const path = '/api/specialtyProduct/doSubscribe?batchId=1&memberName=user_'
const replacement = {
  autoPath: (id) => {
    return `${path}${id}`
  },
  autoId: () => {
    return Math.floor(Math.random() * 2000000).toString()
  },
  autoHeader: (id) => {
    return `{"header":"header"}.{"payload":"${id}"}.sign`
  },
  content: (ret) => {
    const id = replacement.autoId()
    let msg = ret.toString()

    const content = {
      id: id,
      path: replacement.autoPath(id),
      Authorization: replacement.autoHeader(id)
    }
    Object.keys(content).forEach(key => {
      const regexp = new RegExp(`\\[<${key}>\\]`, 'g')
      msg = msg.replace(regexp, content[key])
    })
    const bodyArr = msg.split('\n')
    msg = msg.replace(/Content-Length: \d*/g, `Content-Length: ${bodyArr[bodyArr.length - 2].length}`)
    // console.log(`[${msg}]`)
    return Buffer.from(msg)
  }
}

run({
  url: url,
  connections: 15,
  duration: 30,
  pipelining: 800,
  replacement: replacement,
  requests: [
    {
      method: 'PUT',
      path: '[<path>]',
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        Authorization: '[<Authorization>]'
      },
      body: JSON.stringify({
        name: 'New User',
        email: 'new-[<id>]@user.com' // [<id>] will be replaced with generated HyperID at run time
      })
    }
  ],
  idReplacement: false
}, finishedBench)

function finishedBench (err, res) {
  // console.log('over');
  console.log('finished bench', err, res)
}
