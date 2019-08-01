var axios = require('axios')
var { HOST, PORT } = require('../key')
var CAPTCHA_KEY = require('./key').CAPTCHA_KEY
var md5 = require('blueimp-md5')

const url = `http://${HOST}:${PORT}/`
// const url = 'http://shop.vlink.ltd/'
const getCaptchaUrl = `${url}api/captcha/makecaptchakey?_=`
// const submitCaptchaUrl = `${url}api/login-box`
const captchaVal = '503'
const captchaKey = md5(`${captchaVal}${CAPTCHA_KEY}`)

console.log('target key is ' + captchaKey)

const getCaptcha = async () => {
  let key = ''
  await axios.get(getCaptchaUrl + new Date().getTime()).then(res => { key = res.data })
  return key
}

// const getAnswer = async (cptkey) => {
//   return await axios.post(submitCaptchaUrl, {
//     memberName: 'buy_001',
//     password: 'buy_001',
//     cptkey,
//     captchaVal,
//     clientType: 'wap'
//   }).then(res => res.data)
// }

let success = 0
const testLogin = async () => {
  try {
    const cptkey = await getCaptcha()
    success++
    console.log(success + '...', cptkey.datas.captchaKey)
    if (cptkey.datas.captchaKey === captchaKey) {
      console.log('got it cost ' + success + ' times.')
      return
    } else {
      setTimeout(testLogin, 50)
    }
  } catch (error) {
    console.log(error)
  }
}

testLogin()

// testLogin();
