// Helper function to find a user by email
const getUserByEmail = function(email, database) {
  for (const userId in database) {
    if (database[userId].email === email) {
      return database[userId];
    }
  }
  return null;
};

// Helper function which returns the URLs where the userID is equal to the id of the currently logged-in user
const urlsForUser = (id, database) => {
  const userUrls = {};
  for (const urlId in database) {
    if (database[urlId].userID === id) {
      userUrls[urlId] = database[urlId];
    }
  }
  return userUrls;
};

module.exports = { getUserByEmail, urlsForUser };