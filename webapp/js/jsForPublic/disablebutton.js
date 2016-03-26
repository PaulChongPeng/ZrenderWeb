queryCurrentUserPrivilege();

/**
 * 查询当前登录用户的权限，并根据权限屏蔽或显示
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
      var privilege = result.currentUser.privilege;
      console.log(" disable button privilege********==" + privilege); 
      if (privilege == 2) {
       document.getElementById("export_button").style.visibility = "visible";
      } else {
       document.getElementById("export_button").style.visibility = "hidden";
      }
    },
    error : function(result) {
      //查询失败
      alert("Server error !");
    }
  });
}
