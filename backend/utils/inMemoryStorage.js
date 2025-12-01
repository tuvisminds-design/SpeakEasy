// Shared in-memory storage for candidates when MongoDB is not available
// Key: email, Value: candidate object
const inMemoryCandidates = new Map();
// Key: candidate ID, Value: candidate object
const inMemoryCandidatesById = new Map();

module.exports = {
  inMemoryCandidates,
  inMemoryCandidatesById
};






