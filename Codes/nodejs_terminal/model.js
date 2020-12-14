/* Model */
module.exports = class Staff {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  toString() {
    return `ID: ${this.id} | Name: ${this.name} | Age : ${this.age}`;
  }
};
