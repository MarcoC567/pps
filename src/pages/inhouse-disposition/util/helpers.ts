export function flattenTree(nodes, level = 0, parent = null) {
  let result = [];
  
  for (const node of nodes) {
    const { parts, ...rest } = node;
    result.push({ ...rest, level, parent });
    
    if (parts?.length) {
      result = result.concat(flattenTree(parts, level + 1, node.id));
    }
  }
  
  return result;
}

export function getDispositionResult() {

}