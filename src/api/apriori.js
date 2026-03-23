export function apriori(transactions, minSupport = 0.02, minConfidence = 0.3, maxItemsetSize = 3) {
  const totalTransactions = transactions.length;
  if (totalTransactions === 0) return { rules: [], frequentItemsets: new Map() };

  const { frequentItemsets, currentFrequent } = findFrequentSingletons(transactions, totalTransactions, minSupport);
  let prevFrequent = currentFrequent;

  for (let size = 2; size <= maxItemsetSize; size++) {
    const candidates = generateCandidates(prevFrequent, size);
    if (candidates.length === 0) break;

    const nextFrequent = [];
    for (const candidate of candidates) {
      const count = countTransactionsContaining(candidate, transactions);
      const support = count / totalTransactions;
      if (support >= minSupport) {
        const key = itemsetKey(candidate);
        frequentItemsets.set(key, { items: candidate, support });
        nextFrequent.push(candidate);
      }
    }
    if (nextFrequent.length === 0) break;
    prevFrequent = nextFrequent;
  }

  const rules = generateAssociationRules(frequentItemsets, minConfidence);
  return { rules, frequentItemsets };
}

export function getAprioriSuggestions(cartItems, rules, limit = 4) {
  const cartSet = new Set(cartItems);
  const scored = {};

  for (const rule of rules) {
    if (!rule.antecedent.every((item) => cartSet.has(item))) continue;
    for (const product of rule.consequent) {
      if (cartSet.has(product)) continue;
      const score = rule.confidence * (rule.lift ?? 1);
      scored[product] = Math.max(scored[product] ?? 0, score);
    }
  }

  return Object.entries(scored)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([productId]) => productId);
}

function findFrequentSingletons(transactions, totalTransactions, minSupport) {
  const itemCounts = {};
  for (const tx of transactions) {
    for (const item of tx) itemCounts[item] = (itemCounts[item] ?? 0) + 1;
  }

  const frequentItemsets = new Map();
  const currentFrequent = [];

  for (const [item, count] of Object.entries(itemCounts)) {
    const support = count / totalTransactions;
    if (support >= minSupport) {
      frequentItemsets.set(item, { items: [item], support });
      currentFrequent.push([item]);
    }
  }

  return { frequentItemsets, currentFrequent };
}

function generateCandidates(frequentPrev, size) {
  const candidates = [];
  const seen = new Set();

  for (let i = 0; i < frequentPrev.length; i++) {
    for (let j = i + 1; j < frequentPrev.length; j++) {
      const merged = Array.from(new Set([...frequentPrev[i], ...frequentPrev[j]])).sort();
      if (merged.length !== size) continue;
      const key = itemsetKey(merged);
      if (seen.has(key)) continue;
      seen.add(key);
      candidates.push(merged);
    }
  }

  return candidates;
}

function countTransactionsContaining(itemset, transactions) {
  let count = 0;
  for (const tx of transactions) {
    const txSet = new Set(tx);
    if (itemset.every((item) => txSet.has(item))) count++;
  }
  return count;
}

function generateAssociationRules(frequentItemsets, minConfidence) {
  const rules = [];
  for (const { items, support } of frequentItemsets.values()) {
    if (items.length < 2) continue;
    const subsets = getNonEmptyProperSubsets(items);
    for (const antecedent of subsets) {
      const consequent = items.filter((i) => !antecedent.includes(i));
      if (consequent.length === 0) continue;
      const antKey = itemsetKey(antecedent);
      const antEntry = frequentItemsets.get(antKey);
      if (!antEntry) continue;
      const confidence = support / antEntry.support;
      if (confidence < minConfidence) continue;
      const consKey = itemsetKey(consequent);
      const consEntry = frequentItemsets.get(consKey);
      const lift = consEntry ? confidence / consEntry.support : null;
      rules.push({ antecedent, consequent, support, confidence, lift });
    }
  }

  rules.sort((a, b) =>
    b.confidence !== a.confidence ? b.confidence - a.confidence : (b.lift ?? 0) - (a.lift ?? 0)
  );
  return rules;
}

function getNonEmptyProperSubsets(items) {
  const subsets = [];
  const total = 1 << items.length;
  for (let mask = 1; mask < total - 1; mask++) {
    subsets.push(items.filter((_, idx) => mask & (1 << idx)));
  }
  return subsets;
}

function itemsetKey(items) {
  return items.slice().sort().join("||");
}