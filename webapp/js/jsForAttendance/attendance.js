// 查询按钮
function queryAttendance() {
  var url = "attendanceInfo.action";
  var emp_id = document.getElementById("emp_id").value;
  var timeElement = document.getElementById("query_time");
  var time = timeElement[timeElement.selectedIndex].value;
  //console.log("emp_id:" + emp_id + ", time:" + time);
  $("#attendanceInfoTable").empty();
  $("#attendenceWarning").empty();
  $("#empIdWarning").empty();
  if (emp_id == '') {
    $("#empIdWarning").append("工号不能为空！");
    return;
  }
  $.ajax({
    type : "post",
    url : url,
    data : {
      emp_id : emp_id,
      time : time
    },
    dataType : "JSON",
    success : function(result) {
      // console.log("ajax success");
      // console.log(result);
      var count = result.attendance.length;
      // console.log("count:"+count);
      if (count >= 1) {
        if (result.attendance == "Error_HasNotEmp") {
          $("#empIdWarning").append("该工号不存在！");
          return;
        }
        $("#attendanceInfoTable").append(
            $("<tr>" + "<th class='serialNumber_th'>序号</th>" + "<th class='date_th'>日期</th>" + "<th class='time_th'>时间</th>"
                + "<th class='location_th'>地点</th>" + "</tr>"));
        for (var i = 0; i < count; i++) {
          console.log("result.attendance" + result.attendance);
          var id = i + 1;
          var date = result.attendance[i].date;
          var time = result.attendance[i].time;
          var location = result.attendance[i].location;
          var _str = $("<tr>" + "<td>" + id + "</td>" + "<td>" + date + "</td>" + "<td>" + time + "</td>" + "<td>" + location + "</td>"
              + "</tr>");
          $("#attendanceInfoTable").append(_str);
        }
      } else {
        $("#attendenceWarning").append("无考勤信息！");
      }
    },
    error : function(result) {
      alert("Server error !");
    }
  })
}

// 统计按钮
function statisticsAttendance() {
  var emp_id = document.getElementById("emp_id").value;
  var time = document.getElementById("query_time").value;
  if (emp_id == "请输入被查询的工号") {
    emp_id = "null";
  }
  time = getLatest7DateStr();
  window.open("/BraceletS/html/attendanceStatistic.html?emp_id=" + emp_id + "&&time=" + time, "newwindow",
      "left=200,top=100,height=700,width=800,bgcolor=#ffffff");
}

// 导出按钮
function exportAttendace() {
  var url = "attendanceExport.action";
  var emp_id = document.getElementById("emp_id").value;
  var time = document.getElementById("query_time").value;
  if (emp_id == "请输入被查询的工号") {
    emp_id = "null";
  }
  if (time == "请选择日期") {
    time = "null";
  }
  // console.log("emp_id:"+emp_id+", time:"+time);
  $.ajax({
    type : "post",
    url : url,
    data : {
      emp_id : emp_id,
      time : time
    },
    dataType : "JSON",
    success : function(result) {
      var _str = "工号,姓名,部门,日期,打卡点1,打卡点2,打卡点3,打卡点4,打卡点5,打卡点6\n";
      $.each(result, function(date, list) {
        console.log(date);
        $.each(list, function(n, info) {
          console.log(n + "," + info);
          if (n == 3) {
            _str += date + ",";
          }
          _str += info + ",";

        });
        _str += "\n";
      });

      var BB = self.Blob;
      saveAs(new BB([ "\ufeff" + _str ] // \ufeff防止utf8 bom防止中文乱码
      , {
        type : "text/plain;charset=utf8"
      }), emp_id + ".xls");
    },
    error : function(result) {
      alert("Server error !");
    }
  })
}