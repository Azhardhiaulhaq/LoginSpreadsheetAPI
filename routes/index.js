var express = require('express');
var router = express.Router();
var path = require('path')
const { google } = require('googleapis');
const keys = require('../js/keys.json');

const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);


/* GET home page. */
router.get('/', function(req, res, next) {

  let NIM = req.query.NIM
  // if (typeof NIM == 'undefined'){
  //   alert("ini undefined");
  // }
  console.log('HALOOOOOOO' + NIM)
  // res.render('index', { title: 'Azhar' });
  let reqPath = path.join(__dirname,'../')
  console.log('PATH NOW :' + reqPath)
  res.sendFile(path.join(__dirname+'/../views/Login/index.html'))
});

router.post('/',function(req,res,next){
  console.log('HALOOOOOOOOOOO ' + req.body.NIM)
  var NIM = req.body.NIM;
  client.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
      return;
    } else {
      querySpreadSheet(client, NIM);
      console.log("######################" + name);
      // res.writeHead(200, { 'Content-Type': 'text/html' });
      // res.end(Name);
      console.log("connected");
    }
  });
  res.redirect('/')
});

async function querySpreadSheet(cl, NIM) {
  try {
    const gsapi = google.sheets({ version: 'v4', auth: cl });
    const opt = {
      spreadsheetId: '1z_4n2YlYtipGgPAn8oJ5fSF5kEKa3G0DfUQ6DkQRKqA',
      range: 'Sheet1!A3:E'
    };

    let data = await gsapi.spreadsheets.values.get(opt);
    const rows = data.data.values;
    var Name = "No Name Found";
    console.log("Row Lenght : " + rows.length);
    if (rows.length) {
      var found = false;
      var i = 0;
      while (!found && i < rows.length) {
        if (rows[i][2] == NIM) {
          found = true;
          Name = rows[i][1];
          console.log("found");
          console.log(rows[i][1] + rows[i][2]);
        } else {
          i++;
        }
      }
    } else {
      console.log("No Data Found");
    }
    if (found) {
      let resources = [["Hadir"]];
      var updatecell = i + 3;
      const updateOptions = {
        spreadsheetId: '1z_4n2YlYtipGgPAn8oJ5fSF5kEKa3G0DfUQ6DkQRKqA',
        range: 'Sheet1!F' + updatecell.toString(),
        valueInputOption: 'USER_ENTERED',
        resource: { values: resources }
      };

      let response = await gsapi.spreadsheets.values.update(updateOptions);
      console.log(response);
      console.log(Name);
    }
  } catch (err) {
    next(err);
  } 

}

module.exports = router;
