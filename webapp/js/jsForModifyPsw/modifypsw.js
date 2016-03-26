$(document).ready(function() {

  $("#reset").click(function() {
    $("input[name='oldpassword']").val("请输入旧密码");
    $("input[name='newpassword']").val("请输入新密码");
    $("input[name='newpasswordagain']").val("请再次输入新密码");
  });
  $("form").submit(function() {
    console.log("updatepassword begin");
    var param = $("#oldpassword").val();
    if (param == "请输入旧密码") {
      alert("旧密码不能为空，请先输入旧密码！");
    } else {
      var param = $("#newpassword").val();
      if (param == "请输入新密码") {
        alert("新密码不能为空，请输入新密码！");
      } else {
        var num = $("#newpassword").val().length;
        if (num < 6) {
          alert("新密码长度不能小于6位！");
        } else if (num > 18) {
          alert("新密码长度不能大于18位！");
        } else {
          var tmp = $("#oldpassword").val();
          if ($("#newpassword").val() == tmp) {
            alert("新密码不能和旧密码一样,请重新输入新密码！");
            $("input[name='newpassword']").val("请输入新密码");
          } else {
            var param = $("#newpasswordagain").val();
            if (param == "请再次输入新密码") {
              alert("再次输入的新密码不能为空！");
            } else {
              var tmp = $("#newpassword").val();
              var num = $("#newpasswordagain").val().length;
              if ($("#newpasswordagain").val() != tmp) {
                alert("两次输入的新密码不一致，请重新输入！");
                $("input[name='newpasswordagain']").val("请再次输入新密码");
              } else {
                $.ajax({
                  type : "post",
                  url : "updatepassword.action",
                  async : false,
                  data : {
                    oldpsw : $("input[name='oldpassword']").val(),
                    newpsw : $("input[name='newpassword']").val(),
                  },
                  dataType : "json",
                  success : function(result) {
                    console.log(result);
                    if (result == "errorpsw") {
                      alert("旧密码不对！");
                    } else if (result == "success") {
                      alert("更新密码成功，请重新登录！");
                      window.location.href = "/BraceletS/html/login.html";
                    }
                  },
                  error : function() {
                    alert("服务器未启动，请先启动服务器");
                    return false;
                  }
                });
              }
            }
          }
        }
      }
    }
    return false;
  });

});