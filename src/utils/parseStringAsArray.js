module.exports = {
  parseStringAsArray(arrayAsString) {
    return arrayAsString.split(',').map(tech => tech.toLowerCase().trim());
  },

  formatedTech(tech) {
    return tech ? tech.replace(tech[0], tech[0].toUpperCase()) : "";
  }
};
