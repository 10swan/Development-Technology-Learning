// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio');//读取dom结构中的标签
let superagent = require('superagent');// 发起请求获取页面html代码
let charset = require('superagent-charset')//解决乱码
charset(superagent);

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let serverUrl = "https://m.bige7.com/"
  let result = await superagent.get(serverUrl);// 网页编码
  const $ = cheerio.load(result.text);

  // 热门推荐
  let hotList = $('.hot').find('.image');
  let hotData = []//热榜数据
  for(let i=0;i<hotList.length;i++){
    let obj = {};
    obj['url'] = $(hotList[i]).find('a').attr('href');
    obj['imgurl'] = $(hotList[i]).find('img').attr('src');
    obj['name'] = $(hotList[i]).find('img').attr('alt');
    obj['author'] = $(hotList[i]).next().find('dt').find('span').text();
    obj['detail'] = $(hotList[i]).next().find('dd').text();
    hotData.push(obj);
  }

  // 列表推荐
  let classifyList = $('.block');
  let classifyData = [];
  for(let i=0;i<classifyList.length; i++){
    let obj = {};
    obj['type'] = $(classifyList[i]).find('h2').text();
    let childDom = $(classifyList[i]).find('.lis').find('li');
    let childData = [];
    for(let j=0;j<childDom.length;j++){
      let childObj = {};
      childObj['name'] = $(childDom[j]).find('.s2').find('a').text();
      childObj['author'] = $(childDom[j]).find('.s3').text();
      childObj['url'] = $(childDom[j]).find('s2').find('a').attr('href')
      childData.push(childObj);
    }
    obj['data'] = childData;
    classifyData.push(obj)
  }
  return {hotData,classifyData};
}