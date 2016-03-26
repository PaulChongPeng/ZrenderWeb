initEmployeeList();
var selectedMemberId;
var hasMember;

/**
 * 初始化组员列表 查询当前登录用户及其下属的ID和姓名信息， 并将下属的姓名显示， 同时使用姓名对应的工号作为标签id
 */
function initEmployeeList() {
  console.log("initEmployeeList begin");

  $.ajax({
    type : "POST",
    url : "/BraceletS/employeeName.action",
    dataType : "JSON",
    success : function(result) {
      // 查询成功
      console.log("employeeName ajax success");
      console.log(result);
      count = result.membersList.length;
      console.log("count=" + count);

      if (count >= 1) {
        if(count==1){
          hasMember=false;
        }else{
          hasMember=true;
        }
        if (hasMember) {
          for (var i = 1; i < count; i++) {
            var id = result.membersList[i].empId;
            var name = result.membersList[i].name;
            console.log(name);
            $("#contents").append(
                "<li id='" + id + "' onclick= 'queryMemberLocation(" + id + ")'>" + name + "<br>" + id + "</li>");
          }
          // 初始化selectedMemberId为组员列表第一个下属的ID
          selectedMemberId = result.membersList[1].empId;
          document.getElementById(selectedMemberId).style.color = "#000000";
        }else{
          $("#contents").append(
              "<li>" + "无"  + "</li>");
        }
      } else {
        $("#contents").append(
            "<li>" + "无" + "</li>");
      }
    },
    error : function(result) {
      // 查询失败
      alert("Server error !");
    }
  });
}

/**
 * 查询指定工号的最近位置
 * 
 * @param id
 */
function queryMemberLocation(id) {

  // 恢复之前选中人员的姓名颜色，置黑要查询的员工姓名
  document.getElementById(selectedMemberId).style.color = "#0986ff";
  document.getElementById(id).style.color = "#000000";
  // 将input_id的值同步为选中的员工Id
  document.getElementById("input_id").value = id;
  console.log("queryMemberLocation input_id=" + id);
  // 将selectedMemberId的值同步为选中的员工Id
  selectedMemberId = id;
  queryCurrentLocation();
}
