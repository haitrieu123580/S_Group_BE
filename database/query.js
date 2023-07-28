const executeQuery = ({ db, query }) => {
  return new Promise((resolve, reject) => {
    db.raw(query)
      .then(rows => {
        resolve(rows[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const getOne = async ({ db, query }) => {
  const records = await executeQuery({ db, query })
  if (records.length > 0) {
    return records[0]
  }
  return false
}
const create = async ({ db, query }) => {
  const result = await executeQuery({ db, query });
  if (result.affectedRows > 0) {
    return true;
  }

  return false;
};

const updateOne = async ({ db, query }) => {
  const result = await executeQuery({ db, query })
  if ( result.affectedRows > 0) {
    return true
  }
  return false
}

module.exports = {
  executeQuery,
  getOne,
  create,
  updateOne
}