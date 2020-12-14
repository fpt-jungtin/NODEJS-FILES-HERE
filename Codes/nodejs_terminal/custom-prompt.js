const prompt = require("prompt-sync")({
  sigint: true,
});

var revalidator = require("revalidator");

const typeCasting = function (input, type) {
  if (input === "") return input;

  if (type === "number" && !isNaN(parseInt(input))) {
    return parseInt(input);
  }

  return input;
};

const getInput = function (description, props) {
  let input;
  let isValid = false;
  do {
    input = prompt(`${description} : `);
    if (props.type) input = typeCasting(input, props.type);

    const validation = revalidator.validate(
      { input: input },
      {
        properties: {
          input: props,
        },
      }
    );

    isValid = validation.valid;
    if (!isValid) console.error(`*${validation.errors[0].message}`);
  } while (!isValid);

  return input;
};

module.exports = getInput;
