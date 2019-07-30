// const autocannon = require('autocannon')
const run = require('../../../lib/run')
const { HOST, PORT } = require('../../key')
const jwt = require('../../utils')

// const url = 'http://localhost:3000/'
const url = `http://${HOST}:${PORT}/`
const path = '/api/specialtyProduct/doSubscribe?batchId=1&memberName=user_'
const replacement = {
  autoId: () => {
    return Math.floor(Math.random() * 2000000).toString()
  },
  autoPath: (id) => {
    return `${path}${id}`
  },
  autoJit: () => {
    let jit = ''
    for (let i = 0; i < 32; i++) {
      jit += '' + '0123456789abcdef'.substr(Math.floor(Math.random() * 16), 1)
    }
    return jit
  },
  autoJWT: (id) => {
    return jwt({
      jti: replacement.autoJit(),
      sub: 'wap',
      iat: 1564129528,
      exp: 1564734328,
      params: {
        memberName: `user_${id}`,
        memberId: `${id}`
      }
    })
  },
  content: (ret) => {
    const id = replacement.autoId()
    let msg = ret.toString()

    const content = {
      id: id,
      path: replacement.autoPath(id),
      Authorization: replacement.autoJWT(id)
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
  connections: 1,
  duration: 1,
  pipelining: 1,
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
        email: 'new-[<id>]@user.com'
      })
    }
  ],
  idReplacement: false
}, finishedBench)

function finishedBench (err, res) {
  // console.log('over');
  console.log('finished bench', err, res)
}
