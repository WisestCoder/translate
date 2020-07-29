const axios = require('axios');
const process = require('process');
const cheerio = require('cheerio');
const isChinese = require('is-chinese');
const Spinner = require('cli-spinner').Spinner;
const util = require('../util');
const { chalk } = require('../util');

const word = process.argv[2];
const isCn = isChinese(word);
const url = util.getUrl(word, isCn);

const spinner = new Spinner('正在努力查询中.. %s');
spinner.setSpinnerString('|/-\\');

spinner.start();
axios({ url })
  .then(({ data }) => {
    spinner.stop(true);
    const $ = cheerio.load(data, {
      ignoreWhitespace: true,
      xmlMode: true
    });

    util.logger('关键词', util.getKeyword($, isCn), 'cyan');
    util.logger('短语', util.getPhrase($, isCn), 'magenta');
    util.logger('例句', util.getSentence($, isCn), 'green');
  }).catch(() => {
    spinner.stop(true);
    console.log(chalk.red('查询失败，请检查您的网络'));
  })