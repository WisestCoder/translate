const chalk = require("chalk");
const urlencode = require('urlencode');

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

const logger = (title, list, color = 'blue') => {
  if (!list.length) {
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

module.exports = {
  getKeyword,
  getPhrase,
  getSentence,
  logger,
  chalk,
  getUrl
};