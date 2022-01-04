//需要使用的包文件
const axios = require("axios");
const schedule = require("node-schedule");
//相关参数保存在文件内
const { nuggets, pushPlus } = require("./config");

/**
 * 获取当前时间的格式化时间
 * @param {String} key 调用js日期函数 
 * @returns 当前时间格式化的字符串
 */
const getNowTime = (key) => {
  let nowTime = ``;
  try {
    nowTime = new Date()[key]();
  } catch (e) {
    nowTime = `获取时间函数错误！`;
    console.error(`请传入日期函数 —— ${e}`);
  }
  return nowTime;
}

/**
 * pushplus消息推送，关注wx公众号可以调用他们的接口进行wx消息推送
 * @param {String} title 
 * @param {JSON} content 
 */
const pushMsg = async (title, content) => {
  console.log(`\n------${getNowTime(`toLocaleString`)} 开始推送wx消息 ------`);
  //获取配置参数
  const { url, token } = pushPlus;
  const res = await axios({
    url,
    method: `get`,
    params: {
      token,
      template: `json`,
      title,
      content,
    }
  });
  if (res && res.data) {
    console.log(`\n ${JSON.stringify(res.data)} \n\n------ ${getNowTime(`toLocaleTimeString`)} 推送成功 ------\n`);
  } else {
    console.log(res);
    console.log(`\n------ ${getNowTime(`toLocaleTimeString`)} 推送失败 ------ \n`);
  }
}

/**
 * 掘金自动签到 请求方法
 */
const hacpaiSignRequest = async () => {
  console.log(`\n\n------${getNowTime(`toLocaleDateString`)} - 开始签到------\n`);
  const { headers, signInUrl } = nuggets; //签到相关参数
  const res = await axios({
    url: signInUrl,
    method: `post`,
    headers,
  });
  if (res && res.data) {
    console.log(`\n ${JSON.stringify(res.data)} \n \n ------ ${getNowTime(`toLocaleTimeString`)} 签到成功 ------\n`);
    //签到成功后推送消息
    if (res.data.err_no == 0) {
      pushMsg(`掘金签到结果`, { '获得': `${res.data.data.incr_point}矿石`, '总计': `${res.data.data.sum_point}矿石` })
    } else {
      pushMsg(`掘金签到结果`, res.data);
    }
    //签到成功后，30s内查询免费抽奖次数
    setTimeout(() => {
      freeCheck();
    }, Math.random() * 30 * 1000)
  } else {
    console.log(res);
    console.log(`\n ------ ${getNowTime(`toLocaleTimeString`)} 签到失败 ------ \n`);
    pushMsg(`掘金签到结果`, { '签到失败': res.data }); //签到成功后推送消息
  }
}

/**
 * 查询还有几次免费抽奖的机会
 */
const freeCheck = async () => {
  console.log(`\n------${getNowTime(`toLocaleString`)} 开始查询抽奖次数 ------`);
  const { headers, freeCheckUrl } = nuggets; //查询免费次数相关参数
  const res = await axios({
    url: freeCheckUrl,
    method: `get`,
    headers,
  });
  if (res && res.data) {
    console.log(`\n ------ 获得免费抽奖次数：${res.data.data.free_count || 0} ------\n`);
    if (res.data.data.free_count > 0) {
      //如果有免费抽奖次数直接开始抽奖
      luckDraw();
    }
  } else {
    console.log(res);
    console.log(`\n ------ ${getNowTime(`toLocaleTimeString`)} 查询抽奖次数失败 ------ \n`);
  }
}

/**
 * 掘金抽奖函数方法
 */
const luckDraw = async () => {
  console.log(`\n------${getNowTime(`toLocaleString`)} 开始抽奖 ------`);
  const { headers, drawUrl } = nuggets; //抽奖相关参数
  const res = await axios({
    url: drawUrl,
    method: `post`,
    headers,
  });
  if (res && res.data) {
    console.log(`\n ------ ${getNowTime(`toLocaleTimeString`)}  抽奖成功，获得：${res.data.data.lottery_name} ------\n`);
    let jsonMsg = { '奖品': res.data.data.lottery_name };
    pushMsg(`掘金抽奖结果`, jsonMsg)
  } else {
    console.log(res);
    console.log(`\n ------ ${getNowTime(`toLocaleTimeString`)} 抽奖失败 ------ \n`);
    pushMsg(`掘金抽奖结果`, { '结果': '抽奖失败' })
  }
}

//定时触发任务
const signTask = () => {
  //每天在6:00-6:10随机签到
  schedule.scheduleJob("0 0 6 * * *", () => {
    setTimeout(() => {
      hacpaiSignRequest(); //签到函数
    }, Math.random() * 10 * 60 * 1000)
  })
}

//开始执行任务
console.log(`开始执行任务-${getNowTime('toLocaleString')}`);
signTask();