/* global ApplicationController */
ApplicationController = DefaultController.extend({

  layoutTemplate: 'AppLayout',

  createAction: function (labelKey, action) {
    let that = this;
    return {
      name: function () {
        return i18n(labelKey)
      },
      action: action,
      data: function () {
        return that.data();
      }
    }
  },

  createDefaultActions: function (submitFormSelector, cancelRoute) {
    return [
      this.createAction('save', function () {
        $(submitFormSelector).submit();
      }),
      this.createAction('cancel', function () {
        Router.go(cancelRoute);
      })
    ];
  },

  /**
   * Render actions.
   */
  renderActions: function (submitFormSelector, cancelRoute) {
    let defaultActions = this.createDefaultActions(submitFormSelector, cancelRoute);

    this.render('ContentActions', {
      to: 'actions',
      data: {
        actions: defaultActions
      }
    });
  },
});
