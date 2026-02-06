export const tokenizeTwister = (text: string): string[] => {
  const edgePunctuation = /^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g;

  return text
    .trim()
    .split(/\s+/)
    .map(word => word.replace(edgePunctuation, ''))
    .filter(Boolean);
};
