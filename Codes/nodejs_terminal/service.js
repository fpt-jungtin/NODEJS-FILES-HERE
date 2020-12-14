const getInput = require("./custom-prompt");
const Staff = require("./model");

/* Staff */

let sequence = 0;
const staffs = new Map();
const s1 = new Staff("Trung Thinh", 19);
s1.id = ++sequence;
staffs.set(s1.id, s1);

const s2 = new Staff("Hoang Dung", 19);
s2.id = ++sequence;
staffs.set(s2.id, s2);

const addStaff = function () {
  console.log("\n");
  console.log("====== ADD STAFF ======");
  console.log("Hãy điền đầy đủ thông tin về Staff");
  var name = getInput("Tên", {
    allowEmpty: false,
  });
  var age = getInput("Tuổi", {
    type: "number",
    allowEmpty: false,
    minimum: 18,
  });

  const staff = new Staff(name, age);
  staff.id = ++sequence;
  staffs.set(staff.id, staff);
  console.log("====== BẠN VỪA THÊM THÀNH CÔNG ======");
  console.log(staff.toString());
};

const editStaff = function () {
  console.log("\n");
  console.log("====== EDIT STAFF ======");
  console.log("Vui lòng chọn Staff");

  let staff;
  while (!staff) {
    var inputId = getInput("ID", {
      allowEmpty: false,
      type: "number",
    });

    staff = staffs.get(inputId);
    if (!staff) console.log("*Không tìm thấy Staff với ID này");
  }

  /* Update */
  console.log(
    "\nVui lòng nhập thông tin update(*để trống nếu không muốn update)"
  );
  var name = getInput("Tên", {});
  var age = getInput("Tuổi", {
    type: "number",
    allowEmpty: true,
    minimum: 18,
  });

  staff.name = name === "" ? staff.name : name;
  staff.age = age === "" ? staff.age : age;
};

const removeStaff = function () {
  console.log("\n");
  console.log("====== REMOVE STAFF ======");
  console.log("Vui lòng chọn Staff");

  let staff;
  while (!staff) {
    var inputId = getInput("ID", {
      allowEmpty: false,
      type: "number",
    });

    staff = staffs.get(inputId);
    if (!staff) console.log("*Không tìm thấy Staff với ID này");
  }

  staffs.delete(staff.id);
  console.log(`Bạn vừa xóa Staff : ${staff.toString()}`);
};

const showStaffs = function () {
  console.log("\n");
  console.log("====== LIST ======");
  staffs.forEach((value) => {
    console.log(value.toString());
  });
};

const selectMenu = (index) => {
  switch (index) {
    case 1:
      addStaff();
      break;
    case 2:
      editStaff();
      break;
    case 3:
      removeStaff();
      break;
    case 4:
      showStaffs();
      break;
  }
};

module.exports = {
  addStaff: addStaff,
  editStaff: editStaff,
  removeStaff: removeStaff,
  selectMenu: selectMenu,
};
