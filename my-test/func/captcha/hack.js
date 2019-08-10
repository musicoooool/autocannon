// var axios = require('axios')
var { CAPTCHA_KEY } = require('../../key')
var md5 = require('blueimp-md5')

// const url = `http://${HOST}:${PORT}/`
// const getCaptchaUrl = `${url}api/captcha/makecaptchakey?_=`
// const submitCaptchaUrl = `${url}api/login-box`
const boxes = '0123456'.split('')

const getCaptcha = () => {
  const key = ['', '', '']
  // await axios.get(getCaptchaUrl + new Date().getTime()).then(res => { key = res.data.datas.captchaKey })
  for (let i = 0; i < key.length;) {
    const r = Math.floor(Math.random() * boxes.length)
    if (!key.includes(r)) { key[i++] = r }
  }
  return md5(`${key.join('')}${CAPTCHA_KEY}`)
}

const init = () => {
  const key = ['', '', '']
  for (let i = 0; i < key.length;) {
    const r = Math.floor(Math.random() * boxes.length)
    if (!key.includes(r)) { key[i++] = r }
  }
  const cVal = key.join('')
  const cKey = md5(`${cVal}${CAPTCHA_KEY}`)

  return { captchaVal: cVal, captchaKey: cKey }
}
const { captchaVal, captchaKey } = init()

console.log(`answer is ${captchaVal} and hash is ${captchaKey}.`)

// const getAnswer = async (cptValue) => {
//   return await axios({
//     method: 'post',
//     url: submitCaptchaUrl,
//     data: {
//       memberName: 'buy_001',
//       password: 'buy_001',
//       captchaKey: captchaKey,
//       captchaVal: cptValue,
//       clientType: 'wap'
//     }
//   }).then(res => res.data)
// }

let success = 0
const testLogin = async () => {
  try {
    const cptkey = await getCaptcha()
    // success++
    console.log(`${success++} ... ${cptkey} <--> ${captchaVal}.${captchaKey}`)
    if (cptkey === captchaKey) {
      console.log('got it cost ' + success + ' times.')
      return
    } else {
      setTimeout(testLogin, 1)
    }
  } catch (error) {
    console.log(error)
  }
}

testLogin()

// getAnswer('503').then(res => {
//   console.log(res)
// })

// testLogin();
