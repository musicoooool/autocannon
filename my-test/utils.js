var SECRET = require('./key').SECRET
var jwt = require('jsonwebtoken')

// const Base64 = {
//   encode (str) {
//     return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
//       function toSolidBytes (match, p1) {
//         return String.fromCharCode('0x' + p1)
//       }))
//   },
//   decode (str) {
//     return decodeURIComponent(atob(str).split('').map(function (c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
//     }).join(''))
//   }
// }

const sign = (payload) => jwt.sign(payload, SECRET)

module.exports = sign

// console.log(sign({
//   jti: 'bf27ba153f1b4ff4921888c4f4f4342c',
//   sub: 'wap',
//   iat: 1564129528,
//   exp: 1564734328,
//   params: {
//     memberName: '张三',
//     memberId: 'M001'
//   }
// }))
