/* global TextBlocks */
Meteor.methods({
  
  /**
   * 
   */
  addTextBlock: function(textBlock) {
    check(textBlock, Object);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return TextBlocks.insert(textBlock, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  updateTextBlock: function(modifier, textBlockId) {
    check(modifier, Object);
    check(textBlockId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return TextBlocks.update({ _id: textBlockId }, modifier, {
      tx: true,
      instant: true
    });
  },
  
  /**
   *
   */
  deleteTextBlock: function (textBlockId) {
    check(textBlockId, String);
    
    if (!Roles.userIsInRole(this.userId, ['accountant', 'manager', 'admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return TextBlocks.remove({ _id: textBlockId }, {
      tx: true,
      instant: true
    });
  },
  
  /**
   * 
   */
  clearTextBlocks: function() {
    if (!Roles.userIsInRole(this.userId, ['admin'], Meteor.userDomain(this.userId))) {
      throw new Meteor.Error(401, 'Permission denied');
    }
    
    return TextBlocks.remove({}, {
      tx: true,
      instant: true
    });
  }
});