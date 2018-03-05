/* global App */
if (!$.fn.selectText) {
  $.fn.selectText = function () {
    var doc = document;
    var element = this[0];
    //console.log(this, element);
    if (doc.body.createTextRange) {
      var range = document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
    } else if (window.getSelection) {
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
}

App = (function () {

  this.constructor = function () {
    i18n.showMissing('[no translation for "<%= label %>" in <%= language %>]');
    i18n.setDefaultLanguage('en');
    i18n.setLanguage('en');
    
    Tracker.autorun(() => {
      let user = Meteor.user();
      
      if (user && user.profile && user.profile.language) {
        let language = user.profile.language;
        this.setLanguage(language);
      }
    });
  };

  this.setLanguage = function (lang) {
    i18n.setLanguage(lang);
    numeral.language(lang);
  };

  this.setDomain = function (domain) {
    Meteor.call('updateUserDomain', domain, function (err, res) {
      if (err) {
        console.error(err);
      }
      else {
        console.log('domain set to %s', domain);
      }
    });
  };
  
  this.showModal = function(context, onOk) {
    Session.set('modalDialogContext', context);
    
    this.onOk = onOk;
    $('.modal-dialog').css({
      'opacity': 1.0,
      'pointer-events': 'auto'
    });
  }
  
  this.okModal = function() {
    if (this.onOk) {
      this.onOk();
    }
  }

  this.constructor();

  return this;
}).call({});

if (Meteor.isClient) {

  Meteor.startup(function () {
    var title = AppInfo.name + ' ' + AppInfo.version + ' :: ' + AppInfo.company;
    $('head > title').text(title);
  });
}
