//选择查询时间，精确到月
function selectMonth() {
  $("#query_time").datetimepicker({
    language : 'zh-CN',
    format : 'yyyy-mm',
    autoclose : true,
    todayBtn : true,
    startView : "year",
    minView : "year",
  });
}

// 查询按钮
function queryAttendanceab() {
  var url = "attendanceabInfo.action";
  var emp_id = document.getElementById("emp_id").value;
  var time = document.getElementById("query_time").value;
  
  if (emp_id == "") {
    var empid = selectedMemberId;
  } else {
    var empid = emp_id;  
  }
  /*
   * if(time == "请选择日期"){ time = "null"; alert("请选择日期"); return; }
   */
   console.log("empid:"+empid+", time:"+time);
  $.ajax({
    type : "post",
    url : url,
    data : {
      emp_id : empid,
      time : time
    },
    dataType : "JSON",
    success : function(result) {
      // console.log("ajax success");
      // console.log(result);
      var count = result.attendanceab.length;
      // console.log("count:"+count);
      $("#attendanceInfoTable").empty();
      $("#attendanceInfoTable").append(
          $("<tr>" + "<th width='15%'>序号</th>" + "<th width='35%'>日期</th>"
              + "<th width='50%'>异常原因</th>" + "</tr>"));
      if (count >= 1) {
        for (var i = 0; i < count; i++) {
          var id = i + 1;
          var date = result.attendanceab[i].date;
          var reason = result.attendanceab[i].reason;
          var _str = $("<tr>" + "<td>" + id + "</td>" + "<td>" + date + "</td>"
              + "<td>" + reason + "</td>" + "</tr>");
          $("#attendanceInfoTable").append(_str);
        }
      } else {
        alert("无异常信息！");
      }
    },
    error : function(result) {
      alert("Server error !");
    }
  })
}