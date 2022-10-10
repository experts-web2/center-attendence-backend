module.exports = {
  /**
   *
   * @param {*} db DB instance
   * @param {*} client  unknown
   * @returns MongoDB query to process migration
   * Updates all documents and adds 'deleted' property to them
   */
  async up(db, client) {
    return await db
      .collection('users')
      .updateMany({}, { $set: { deleted: false } });
  },

  /**
   *
   * @param {*} db DB instance
   * @param {*} client  unknown
   * @returns MongoDB query to process migration
   * Removes 'deleted' property from all documents, rollbacking the migration essentially
   */
  async down(db, client) {
    return await db.collection('users').updateMany({}, { $unset: 'deleted' });
  },
};
