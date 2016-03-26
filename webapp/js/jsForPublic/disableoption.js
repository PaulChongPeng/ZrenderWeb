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
      
      console.log("ppppp privilege********" + privilege);
      
      if (privilege == 1||privilege ==2) {
        document.getElementById("li_location").style.visibility = "visible";
        document.getElementById("li_identityau").style.visibility = "visible";
      } else if (privilege == 4)  {
        document.getElementById("li_location").style.visibility = "visible";
      }
    },
    error : function(result) {
      //查询失败
      alert("Server error !");
    }
  });
}
