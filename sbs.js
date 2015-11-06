var request = require('request'),
    jar = request.jar(),
    request = request.defaults({ jar: jar }),
    cheerio = require('cheerio'),
    postRequestData = {
      url: 'http://www.sbs.gob.pe/app/stats/tc-cv.asp',
      form: {
        FECHA_CONSULTA: '05/11/2015',
        button22: 'Consultar'
      },
      headers: {
        'Content-Length': '48',
        'Host': 'www.sbs.gob.pe',
        'Origin': 'http://www.sbs.gob.pe',
        'Referer': 'http://www.sbs.gob.pe/app/stats/tc-cv.asp',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': 1
      }
    },
    SBS = {};

SBS.get = function(date) {
  if (date) {
    postRequestData.form.FECHA_CONSULTA = date;
  }

  var promise = new Promise(function(resolve, reject) {
    request.get('http://www.sbs.gob.pe/app/stats/tc-cv.asp', function(err, httpResponse, body) {
      request.post(postRequestData, function(err, httpResponse, body) {
        if (err) {
          reject(err);
        }
        else {
          var data = processRequest(body);

          resolve(data);
        }
      });
    });
  });

  return promise;
}

function processRequest(body) {
  var $ = cheerio.load(body),
      tables = $('table.APLI_tabla'),
      moneyExchange = tables.eq(0),
      data;

  data = moneyExchange.find('tr:not(.APLI_fila1)').map(function(index, item) {
    var row = $(item),
        currency = row.children().eq(0),
        buy = row.children().eq(1),
        sell = row.children().eq(2);

    return {
      currency: currency.text().trim(),
      buy: buy.text().trim(),
      sell: sell.text().trim()
    }
  }).get();

  return data;
}

module.exports = SBS;