function isValidSize(size) {
  // Regular expression to match standard sizes and numeric sizes
  const sizePattern = /^(S|M|L|XL|XXL|XXXL|\d{1,2})$/i;
  return sizePattern.test(size);
}

export default isValidSize;
