//查询今日是否签到成功接口  https://api.juejin.cn/growth_api/v1/get_today_status
module.exports = {
  //掘金相关参数
  nuggets: {
    signInUrl: `https://api.juejin.cn/growth_api/v1/check_in`, //签到接口
    freeCheckUrl: `https://api.juejin.cn/growth_api/v1/lottery_config/get`, //免费抽奖次数查询
    drawUrl: `https://api.juejin.cn/growth_api/v1/lottery/draw`, //抽奖接口
    headers: {
      Referer: "https://juejin.cn/",
      "Upgrade-Insecure-Requests": 1,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
      cookie: `这里填写自己的cookie，登录掘金网页版后打开控制台的network，随便找一个请求，查看请求头里面的cookie复制过来即可`, //用自己的
    }, //相关请求头
  },
  //消息推送相关参数 关注pushplus微信公众号可以获得一对一推送的调用参数，不是推广
  pushPlus: {
    url: `http://www.pushplus.plus/send`, //微信推送URL
    token: `这个是pushplus里面获取的token，关注公众号然后打开官网找到一对一推送就可以拿到token了`, //没有广告啊，这是免费的
  }
}