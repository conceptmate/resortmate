/* global ConceptMate */
ConceptMate = typeof ConceptMate !== 'undefined' ? ConceptMate : {};

ConceptMate.BackupConfig = {
  allowed: function() {
    let domain = Meteor.userDomain(this.userId);
    return Roles.userIsInRole(this.userId, ['admin'], domain);
  }
}; 