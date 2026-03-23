export function userBasedCollaborativeFilter(targetUserId, allRatings, k = 5, limit = 8) {
  if (!allRatings || allRatings.length === 0) return [];

  const userMap = buildUserProductMatrix(allRatings);
  const targetRatings = userMap[targetUserId] ?? {};
  const otherUserIds = Object.keys(userMap).filter((id) => id !== targetUserId);
  if (otherUserIds.length === 0) return [];

  const similarities = otherUserIds
    .map((uid) => ({ userId: uid, similarity: cosineSimilarity(targetRatings, userMap[uid]) }))
    .filter((s) => s.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
  if (similarities.length === 0) return [];

  const seenByTarget = new Set(Object.keys(targetRatings));
  const productScores = aggregateProductScores(similarities, userMap, seenByTarget);

  return Object.entries(productScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([productId]) => productId);
}

export function buildUserProductMatrix(allRatings) {
  const matrix = {};
  for (const { userId, productId, rating } of allRatings) {
    if (!matrix[userId]) matrix[userId] = {};
    matrix[userId][productId] = rating;
  }
  return matrix;
}

export function cosineSimilarity(vecA, vecB) {
  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0, normA = 0, normB = 0;
  for (const key of keys) {
    const a = vecA[key] ?? 0;
    const b = vecB[key] ?? 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export function aggregateProductScores(neighbours, userMap, seenProducts) {
  const scores = {};
  for (const { userId, similarity } of neighbours) {
    const neighbourRatings = userMap[userId] ?? {};
    for (const [productId, rating] of Object.entries(neighbourRatings)) {
      if (seenProducts.has(productId)) continue;
      if (!scores[productId]) scores[productId] = 0;
      scores[productId] += similarity * rating;
    }
  }
  return scores;
}

export function pearsonSimilarity(vecA, vecB) {
  const sharedKeys = Object.keys(vecA).filter((k) => vecB[k] !== undefined);
  const n = sharedKeys.length;
  if (n === 0) return 0;

  const avgA = sharedKeys.reduce((s, k) => s + vecA[k], 0) / n;
  const avgB = sharedKeys.reduce((s, k) => s + vecB[k], 0) / n;

  let num = 0, denA = 0, denB = 0;
  for (const k of sharedKeys) {
    const diffA = vecA[k] - avgA;
    const diffB = vecB[k] - avgB;
    num += diffA * diffB;
    denA += diffA * diffA;
    denB += diffB * diffB;
  }
  const denom = Math.sqrt(denA) * Math.sqrt(denB);
  return denom === 0 ? 0 : num / denom;
}