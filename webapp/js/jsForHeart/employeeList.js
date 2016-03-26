initEmployeeList();
var selectedMemberId;

function initEmployeeList() {
  console.log("initEmployeeList begin");

  $.ajax({
    type : "POST",
    url : "/BraceletS/employeeName.action",
    dataType : "JSON",
    success : function(result) {
      console.log("employeeName ajax success");
      console.log(result);
      count = result.membersList.length;
      console.log("count=" + count);

      if (count >= 1) {
        for (var i = 0; i < count; i++) {
          var id = result.membersList[i].empId;
          var name = result.membersList[i].name;
          console.log(name);
          $("#contents").append(
              "<li id='" + id + "' onclick= 'queryMemberheartbeat(" + id + ")'>" + name + "<br>" + id + "</li>");
        }

      } else {
        alert("There is no Member information !");
      }
      selectedMemberId = result.membersList[0].empId;
      document.getElementById(selectedMemberId).style.color = "#000000";

    },
    error : function(result) {
      alert("Server error !");
    }
  });
}

function queryMemberheartbeat(id) {

  document.getElementById(selectedMemberId).style.color = "#0986ff";
  document.getElementById(id).style.color = "#000000";
  console.log("queryMemberLocation input_id=" + id);
  selectedMemberId = id;
  document.getElementById("input_id").value = id;
  querycurrent(selectedMemberId);
}
