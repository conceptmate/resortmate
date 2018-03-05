/* global ReactiveDict */
let reRender = new ReactiveVar();

Template.CountersEdit.onCreated(function () {
  this.counters = new ReactiveVar();
});

Template.CountersEdit.onRendered(function () {
  this.autorun(() => {
    let render = reRender.get();
    Meteor.call('getCounters', (err, counters) => {
      if (err) {
        console.error(err)
      }
      else {
        this.counters.set(counters);
      }
    });
  });
});

Template.CountersEdit.onDestroyed(function () {
  delete this.counters;
});

Template.CountersEdit.helpers({

  counters: function () {
    let tmpl = Template.instance();
    return {
      counters: tmpl.counters.get()
    }
  }
});

AutoForm.hooks({
  'counters-form': {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      Meteor.call('setCounters', insertDoc.counters, (err, res) => {
        if (err) {
          this.done(new Error("Submission failed"));
        }
        else {
          this.done();
          reRender.set(false);
          reRender.set(true);
          Router.go('admin.counters.edit');
        }
      });
      return false;
    }
  }
});