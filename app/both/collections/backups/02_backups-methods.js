/* global ConceptMate */
/* global BackupCollections */
Meteor.methods({
  
  /**
   * 
   */
  addBackupCollection0: function(backupCollection) {
    console.log('backupCollection %o', backupCollection);
    check(backupCollection, Object);
    
    return ConceptMate.Collections.BackupCollections.insert(backupCollection);
  },
  
  /**
   * 
   */
  updateBackupCollection0: function(modifier, backupCollectionId) {
    check(backupCollectionId, String);
    
    return ConceptMate.Collections.BackupCollections.update({ _id: backupCollectionId }, modifier);
  },
});