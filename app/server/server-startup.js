/* global CronJob */
/* global wkhtmltopdf */
/* global Migrations */
/* global Accounts */
/* global PrintHelper */
PrintHelper = (function () {

  this.generatePdf = function (url, outputStream, options) {

    if (!options) {
      options = {
        pageSize: 'A4',
        printMediaType: true,
        marginTop: '15mm',
        marginLeft: '15mm',
        marginRight: '15mm',
        marginBottom: '14mm'
      };
    }

    wkhtmltopdf(url, options).pipe(outputStream);
  }

  return this;

}).call({});



/* global Meteor */
Meteor.startup(function () {

  if (Meteor.users.find().count() === 0) {

    let user = {
      email: 'me@romanraedle.com',
      password: 'password',
      domain: 'pension-dorfstuben.de'
    }

    let userId = Accounts.createUser(user);

    let fixedDomain = user.domain.replace('.', '_');
    let roles = {};
    roles[fixedDomain] = ['admin'];

    let modifier = {
      $set: {
        domain: user.domain,
        roles: roles
      }
    };
      
    // update the user object including roles and domain
    Meteor.users.update({ _id: userId }, modifier);
  }
  
  // migrate to latest version
  Migrations.migrateTo('latest');

  var performBackup = Meteor.bindEnvironment(() => {
    console.log("backup collections");
    ConceptMate.Backup.exportAllCollections();
  });

  var stoppedBackup = Meteor.bindEnvironment(() => {
    /* This function is executed when the job stops */
  });

  // * * * * * 
  // ┬ ┬ ┬ ┬ ┬
  // │ │ │ │ │
  // │ │ │ │ │
  // │ │ │ │ └───── day of week (0 - 7) (0 to 6 are Sunday to Saturday, 7 is Sunday again)
  // │ │ │ └────────── month (1 - 12)
  // │ │ └─────────────── day of month (1 - 31)
  // │ └──────────────────── hour (0 - 23)
  // └───────────────────────── min (0 - 59)
  var job = new CronJob('0 2 * * *', performBackup, stoppedBackup, true /* Start the job right now */);

  Meteor.methods({

    getServerDate: function () {
      return new Date();
    },

    printPdf: function (type, id, options) {

      var fs = Npm.require('fs');

      let url = type + '/print/' + id;
      if (options && options.language) {
        url += '?lang=' + options.language;
      }

      let absoluteUrl = Meteor.absoluteUrl(url);
      let outputFilename = options && options.filename ? options.filename : 'out.pdf';
      let outputStream = fs.createWriteStream(outputFilename);

      PrintHelper.generatePdf(absoluteUrl, outputStream);
    }
  });
});