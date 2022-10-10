module.exports = {
  /**
   *
   * @param {*} db DB instance
   * @param {*} client unknown
   * @returns MongoDB query to process migration
   * Updates all centers and adds 'managers' property to them
   */
  async up(db, client) {
    return await db
      .collection('centers')
      .updateMany({}, { $set: { managers: [] } });
  },

  /**
   *
   * @param {*} db DB instance
   * @param {*} client unknown
   * @returns MongoDB query to undo migration
   * Rollbacks 'managers' property from centers
   */
  async down(db, client) {
    return await db
      .collection('centers')
      .updateMany({}, { $unset: 'managers' });
  },
};
