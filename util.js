const chalk = require("chalk");
const urlencode = require('urlencode');
const fs = require('fs');
const path = require('path');
const process = require('process');
const http = require('http');
const player = require('play-sound')(opts = {});
const os = require('os');

const HOMEDIR = os.homedir();

/**
 * 获取翻译后的关键词
 * @param {*} $ 
 * @param {*} isCn 
 */
const getKeyword = ($, isCn) => {
  const keywords = [];

  if(isCn) {
    $('div.trans-container > ul p.wordGroup').find('a.search-js').each(function() {
      keywords.push( $(this).text().replace(/\s+/g," "));
    });
  } else {
    result = $('div#phrsListTab > div.trans-container > ul').find('li').each(function() {
      keywords.push($(this).text().replace(/\s+/g," "));
    });
  }

  return keywords.slice(0, 4);
}

/**
 * 获取翻译后的短语
 * @param {*} $ 
 * @param {*} isCn 
 */
const getPhrase = ($, isCn) => {
  const phrase = [];

  if(isCn) {
    $('div#authTransToggle ul.wordGroup>li.wordGroup').find('span.def').each(function() {
      phrase.push($(this).text().trim().replace(/\s+/g," "));
    });
  } else {
    $('div#wordGroup2').find('p.wordGroup').each(function() {
      phrase.push($(this).text().trim().replace(/\s+/g," "));
    })
  }

  return phrase.slice(0, 4);
}

const getSentence = ($, isCn) => {
  const sentence = [];

  $('div#bilingual>ul').find('li').each(function() {
    sentence.push($(this).text().trim().replace(/\s+/g," "));
  });

  return sentence.slice(0, 4);
}

const logger = (title = '', list = [], color = 'blue') => {
  if (!(list && list.length)) {
    console.log();
    return;
  }

  console.log();
  console.log(chalk[color](`[${title}]`));
  list.forEach((item) => {
    console.log(`  ${chalk[color](item)}`);
  });
}

const getUrl = (word, isCn) => {
  return isCn 
    ? `http://dict.youdao.com/w/en/${urlencode(word)}`
    : `http://dict.youdao.com/w/${urlencode(word)}`;
}

const getVideoPath = () => {
  const dir = path.join(HOMEDIR, '.video');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.normalize(`${dir}/translate.mp3`)
};

const deleteVideo = () => {
  fs.unlinkSync(getVideoPath());
}

const playVideo = () => {
  player.play(getVideoPath(), function(err) {
    if (err) throw err;
    deleteVideo();
  })
}

const handleVideo = (word, isCn) => {
  const req = http.request({
    "method": 'GET',
    "hostname": 'tts.baidu.com',
    "path": `/text2audio?lan=${isCn ? 'zh' : 'en'}&ie=UTF-8&spd=2&text=${urlencode(word)}`
  }, function(res) {
    const chunks = [];
    res.on('error', function(err) {
      console.log(err);
    })
    res.on("data", function(chunk) {
      chunks.push(chunk);   // 获取到的音频文件数据暂存到chunks里面
    });

    res.on("end", function() {
      const body = Buffer.concat(chunks);
      fs.writeFileSync(getVideoPath(), body);
      playVideo();
    });
  });

  req.end();
}

module.exports = {
  getKeyword,
  getPhrase,
  getSentence,
  logger,
  chalk,
  getUrl,
  handleVideo,
  playVideo,
  deleteVideo,
  getVideoPath
};