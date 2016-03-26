var privilege;

queryCurrentUserPrivilege();

function queryCurrentUserPrivilege() {
  console.log("queryCurrentUserPrivilege begin");

  $.ajax({
    type : "POST",
    url : "/BraceletS/currentUser.action",
    dataType : "JSON",
    success : function(result) {
      console.log(result);
      if(result.currentUser==null){
        window.location.href="/BraceletS/html/login.html";
      }else{
        privilege = result.currentUser.privilege;
        if (privilege == 1||privilege ==2) {
          document.getElementById("personnel").style.visibility = "visible";
        } else {
          document.getElementById("personnel").style.visibility = "hidden";
        }
      }
    },
    error : function(result) {
      alert("Server error !");
    }
  });
}
