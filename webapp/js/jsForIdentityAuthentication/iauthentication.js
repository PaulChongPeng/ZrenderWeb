// bind button
var bracelet_id;
var number_id;

function uploadFileCheck() {

  var filepath = document.getElementById("bindfile").value;
  if (filepath == "") {
    alert("请选择文件！");
    return false;
  } else {
    return true;
  }

}

function checkUser() {
  bracelet_id = document.getElementById("inid").value;
  number_id = document.getElementById("innumber").value;
  if (bracelet_id == "请输入ID" && number_id != "请输入工号") {
    alert("请输入手环ID!");
    return false;
  }
  if (bracelet_id == "请输入ID" && number_id == "请输入工号") {
    alert("请输入手环ID和员工ID!");
    return false;
  }
  if (bracelet_id != "请输入ID" && number_id == "请输入工号") {
    alert("请输入员工ID!");
    return false;
  } else {
    return true;
  }
}

function bindfunction(arg) {
  var url;// document.getElementById("inid").value;;
  var isbind;
  if (arg == "绑定") {
    url = "/BraceletS/bind.action";
    isbind = true;
  } else if (arg == "解除") {
    url = "/BraceletS/unbind.action";
    isbind = false;
  }

  // var id = document.getElementById("inid").value;
  // var number = document.getElementById("innumber").value;

  console.log(bracelet_id);
  console.log(number_id);
  console.log(url);
  if (checkUser()) {

    $.ajax({
      type : "post",
      url : url,
      data : {
        empId : number_id,
        braceletId : bracelet_id
      },
      dataType : "JSON",
      success : function(result) {
        console.log("ajax success");
        console.log(result);
        if (isbind)
          alert(result.bindResult);
        else
          alert(result.unbindResult);
      },
      error : function(result) {
        alert("************Server error !");
      }
    });

  }

}

function bindbatch(arg) {

  var url;
  var isbind;
  var filepath = document.getElementById("bindfile").value;

  console.log("bindbatch java script");
  console.log(arg);
  if (arg == "批量绑定") {
    url = "/BraceletS/bindbatch.action";
    isbind = true;

  } else if (arg == "批量解绑") {
    url = "/BraceletS/unbindbatch.action";
    isbind = false;
  }

  /*
   * if (filepath == "") {
   * 
   * if (isbind) { alert("绑定失败，请选择文件!"); } else { alert("解绑失败，请选择文件!"); }
   * return; }
   */

  // var filetmp = "";
  // var filePath = document.getElementById("upfile").value;
  console.log(filepath);
  $.ajax({
    type : "post",
    url : url,
    data : {
      excelFile : filepath,
    },
    dataType : "JSON",
    success : function(result) {
      console.log("ajax success");
      console.log(result);
      if (result.fileCheckResult == "FileError") {
        alert("文件内容有误，请检查！");
      } else if (result.fileCheckResult == "FileNotExist") {
        alert("请上传文件！");
      } else {

        if (isbind)
          alert("需要绑定数: " + result.bindBatchNum + "\n" + "绑定成功数: "
              + result.bindNum);
        else
          alert("需要解绑数: " + result.unbindBatchNum + "\n" + "解绑成功数: "
              + result.unbindNum);
      }

    },
    error : function(result) {
      alert("************Server error !");
    }
  });

}