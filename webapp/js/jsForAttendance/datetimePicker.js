/*
$("#query_time").datetimepicker({
  language : 'zh-CN',
  format : 'yyyy-mm',
  autoclose : true,
  todayBtn : true,
  startView : "year",
  minView : "year",
});
*/

/**
 * Get Date 'addDayCount' Days From Today 
 * if 'addDayCount' is negative , its result is 'addDayCount' before today
 * or else 'addDayCount' is positive, its result is 'addDayCount' after today
 * eg:today is 2016-03-12
 *    addDayCount = -1,return 2016-03-11
 *    addDayCount = 1, return 2016-03-13
 */
function getDateStr(addDayCount){
  var today = new Date();
  today.setDate(today.getDate() + addDayCount);
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  if(month < 10){
    month = "0" + month;
  }
  if(day < 10){
    day = "0" + day;
  }
  var dateString = year + "-" + month + "-" + day;
  //console.log("dateString:"+dateString);
  return dateString;
}

/**
 * Get Latest 7 Days's Date
 * 
 * @returns {Array}
 * eg:today is 2016-03-12,return from 2016-03-11 to 2016-03-05
 */
function getLatest7DateStr(){
  var latest7DateList = new Array();
  for(var i = 0; i < 7; i++){
    latest7DateList[i] = getDateStr(-(i+1));
  }
  //console.log("latest7DateList:"+latest7DateList);
  return latest7DateList;
}

$("#query_time").append("<option value='"+getLatest7DateStr()+"'>最近七天</option>");
//Set This Month's Date,from yesterday to this month's first day
//eg,today is 2016-03-12,will set from 2016-03-11 to 2016-03-01
var today = new Date();
var days = today.getDate();
//console.log("today is "+days+"st day!");
var i = 1;
while(i != days){
  $("#query_time").append("<option value='"+getDateStr(-i)+"'>"+getDateStr(-i)+"</option>"); 
  i++;
}
//Set Last Month's Date
//eg,today is 2016-03-12,will set from 2016-02-29 to 2016-02-01
today.setDate(0);
var lastMonthDaysCount = today.getDate();
//console.log("last month's last day is  "+lastMonthDaysCount);
var j = 1;
while(j != lastMonthDaysCount+1){
  $("#query_time").append("<option value='"+getDateStr(-i)+"'>"+getDateStr(-i)+"</option>"); 
  j++;
  i++;
}