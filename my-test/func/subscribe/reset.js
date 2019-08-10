var request = require('request')
var http = require('http')
var jwt = require('../../utils')
var { HOST, PORT } = require('../../key')

const getToken = () => {
  let jti = ''
  for (let i = 0; i < 32; i++) {
    jti += '' + '0123456789abcdef'.substr(Math.floor(Math.random() * 16), 1)
  }

  return jwt({
    jti: jti,
    sub: 'buy_001',
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24),
    params: {
    }
  })
}

const draw = () => {
  const drawParams = {
    shenZhenIndicator: 9154.65,
    batchId: 1,
    smallMediumIndicator: 5584.23
  }

  var options = {
    method: 'PUT',
    url: `http://${HOST}:${PORT}/api/specialtyProduct/doDraw`,
    headers:
    {
      'cache-control': 'no-cache',
      Connection: 'keep-alive',
      'Accept-Encoding': 'gzip, deflate',
      Host: 'shop.vlink.ltd',
      Accept: '*/*',
      'Content-Type': 'application/json',
      token: getToken()
    },
    body: drawParams,
    json: true
  }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    console.log(body)
  })
}

const reset = () => {
  var options = {
    method: 'PUT',
    hostname: HOST,
    path: '/api/specialtyProduct/reset',
    headers: {
      Authorization: getToken(),
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Cache-Control': 'no-cache',
      Host: 'shop.vlink.ltd',
      'Accept-Encoding': 'gzip, deflate',
      Connection: 'keep-alive',
      'cache-control': 'no-cache'
    }
  }
  const params = {
    id: 1,
    activityId: 1,
    commonId: 39,
    goodsId: 2,
    strBeginTime: '2019-08-07 09:30:00', // 申购开始时间
    strEndTime: '2019-08-07 09:45:00', // 申购结束时间(开始抽签时间)
    issueQuantity: 5, // 发布数量(预约数量大于发布数量，抽签后这个数量就是中签数量)
    phone: '010-12345678', //
    strPayExpireTime: '2019-08-08 00:00:00'
  }

  var req = http.request(options, function (res) {
    var chunks = []

    res.on('data', function (chunk) {
      chunks.push(chunk)
    })

    res.on('end', function () {
      var body = Buffer.concat(chunks)
      console.log(body.toString())
    })
  })

  req.write(JSON.stringify(params)) // 付款截止日期
  req.end()
}

// draw()
const args = process.argv
if (args.length < 3) {
  console.log('args: draw | reset')
} else {
  const arg = args[2]
  switch (arg) {
    case 'draw':
      console.log('draw')
      draw()
      break
    case 'reset':
      console.log('reset')
      reset()
      break
    default:
      console.log('args: draw | reset')
      break
  }
}
