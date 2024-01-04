function generateUID() {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("00" + firstPart.toString(36)).slice(-3);
  secondPart = ("00" + secondPart.toString(36)).slice(-3);
  var result = firstPart + secondPart;

  result = result
    .split("")
    .map((v) => (Math.round(Math.random()) ? v.toUpperCase() : v.toLowerCase()))
    .join("");

  return result;
}

function mergeObjectArrays(arr1, arr2, byProperty) {
  const ids = new Set(arr1.map((d) => d[byProperty]));

  const result = [...arr1, ...arr2.filter((d) => !ids.has(d[byProperty]))];

  return result;
}

function fraction2decimal(fraction) {
  fraction = fraction.toString();
  var result,
    wholeNum = 0,
    frac,
    deci = 0;
  if (fraction.search("/") >= 0) {
    if (fraction.search("-") >= 0) {
      wholeNum = fraction.split("-");
      frac = wholeNum[1];
      wholeNum = parseInt(wholeNum, 10);
    } else {
      frac = fraction;
    }
    if (fraction.search("/") >= 0) {
      frac = frac.split("/");
      deci = parseInt(frac[0], 10) / parseInt(frac[1], 10);
    }
    result = wholeNum + deci;
  } else {
    result = fraction;
  }
  return result;
}

export default {
  generateUID,
  mergeObjectArrays,
  fraction2decimal,
};
