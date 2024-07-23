function isValidHexColor(hex) {
  const hexColorPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexColorPattern.test(hex);
}

export default isValidHexColor;

// #dc2626
