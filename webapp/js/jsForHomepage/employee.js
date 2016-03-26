initEmployeeList();

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
				$("#welcome_user").append(
						"欢迎" + result.membersList[0].name + "登录");
			} else {
				alert("There is no Member information !");
			}
		},
		error : function(result) {
			alert("Server error !");
		}
	});
}
