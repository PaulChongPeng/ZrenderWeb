$(document).ready(function() {
  $("form").submit(function() {
    if ($("input[name='empId']").val() == "请输入工号") {
      alert("用户名不能为空");
      return false;
    } else if ($("input[name='passwd']").val() == "请输入密码") {
      alert("密码不能为空");
      return false;
    } else {
      $.ajax({
        type : "post",
        url : "login.action",
        async : false,
        data : {
          empId : $("input[name='empId']").val(),
          passwd : $("input[name='passwd']").val(),
        },
        dataType : "json", // 返回数据形式为json
        success : function(result) {
          if (result == "user") {
            alert("不存在该用户！");
          } else if (result == "password") {
            alert("密码错误！");
            // console.log(result);
          } else if (result == "success") {
            // alert("登录成功！");
            window.location.href = "/BraceletS/html/homepage.html";
          }
        },
        error : function() {
          alert("服务器未启动，请先启动服务器");
          return false;
        }
      });
      return false;
    }

  });
});

function jumpToNewHtml() {
  window.location.href = "/BraceletS/html/homepage.html";
}