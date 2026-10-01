const matrices = [{ Leads: { View: true } }, {}];
const mergePermissions = (...matrices) => matrices.reduce((merged, matrix) => {
  Object.entries(matrix || {}).forEach(([module, actions]) => {
    merged[module] = { ...merged[module] };
    Object.entries(actions).forEach(([action, allowed]) => { merged[module][action] = Boolean(merged[module][action] || allowed); });
  });
  return merged;
}, {});

console.log(mergePermissions(...matrices));
