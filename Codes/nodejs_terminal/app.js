const { selectMenu } = require("./service");
const getInput = require("./custom-prompt");

const isRunning = true;

const program = async function () {
  while (isRunning) {
    console.log("\n\n");
    console.log("====== QUẢN LÝ NHÂN VIÊN ======");
    console.log("1. Thêm nhân viên");
    console.log("2. Chỉnh sửa nhân viên");
    console.log("3. Xóa nhân viên");
    console.log("4. Hiển thị tất cả nhân viên");
    console.log("5. EXIT");

    const index = getInput("Điền index", {
      allowEmpty: false,
      type: "number",
    });
    if (index >= 1 && index <= 4) {
      selectMenu(index);
    } else if (index === 5) {
      process.exit();
    }
  }
};

program();
