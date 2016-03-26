$(document).ready(function() {
  var location = String(window.document.location.href);
  var len = location.length;
  var offset = location.indexOf("?");
  var string = location.substring(offset, len);
  var info = string.split("&&");
  var emp_id = (info[0].split("="))[1];
  var time = (info[1].split("="))[1];
  // alert(emp_id+", "+time);

  var url = "attendanceStatistic.action";
  var time_num = "0";
  // console.log("emp_id:" + emp_id + ", time:" + time);
  $.ajax({
    type : "post",
    url : url,
    data : {
      emp_id : emp_id,
      time : time
    },
    dataType : "JSON",
    success : function(result) {
      var _str = "";
      $.each(result, function(date, timelist) {
        _str += "<tr align='center'><td>" + date + "</td>";
        // console.log(date);
        $.each(timelist, function(n, time) {
          _str += "<td>" + time + "</td>";
          time_num = n;
          // console.log(n + "," + time);
        });
        while (time_num < 5) {
          _str += "<td></td>"
          time_num++;
        }

        _str += "</tr>"
      });
      $("#attendanceStaticTable").append(_str);
    },
    error : function(result) {
      alert("Server error !");
    }
  })
});