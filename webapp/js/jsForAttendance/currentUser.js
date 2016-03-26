queryCurrentUserPrivilege();

/**
 * 查询当前登录用户的权限，并根据权限屏蔽或显示员工ID输入框
 */
function queryCurrentUserPrivilege() {
  console.log("queryCurrentUserPrivilege begin");

  $.ajax({
    type : "POST",
    url : "/BraceletS/currentUser.action",
    dataType : "JSON",
    success : function(result) {
      //查询成功
      console.log(result);
      if(result.currentUser==null){
        window.location.href="/BraceletS/html/login.html";
      }else{
        var privilege = result.currentUser.privilege;
        if (privilege == 1||privilege ==2) {
          //人事权限，显示员工ID输入框
          document.getElementById("emp_id_label").style.visibility = "visible";
          document.getElementById("emp_id_HR").style.visibility = "visible";
        } else {
          //非人事权限，屏蔽员工ID输入框
          document.getElementById("emp_id_label").style.visibility = "hidden";
          document.getElementById("emp_id_HR").style.visibility = "hidden";
        }
      }
    },
    error : function(result) {
      //查询失败
      alert("Server error !");
    }
  });
}
