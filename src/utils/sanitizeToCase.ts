const sanitizeToCase = (input, isPascal = false) => {
  return input
    .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters but keep spaces for splitting
    .trim()
    .split(/\s+/) // Split by spaces
    .map((word, index) => {
      if (index === 0 && !isPascal) {
        return word.charAt(0).toLowerCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

export default sanitizeToCase