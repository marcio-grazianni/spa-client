$(document).ready ->

	myTimer = false

	$('.fa-question-circle').mouseenter ->
		id = $(this).attr('id')
		$('.tt').hide()
		$("##{ id }.tt").show()
		clearTimeout(myTimer)

	$('.tt').mouseenter ->
		id = $(this).attr('id')
		$("##{ id }.tt").show()
		clearTimeout(myTimer)

	$('.fa-question-circle').mouseleave ->
			id = $(this).attr('id')
			myTimer = setTimeout( -> 
				$("##{ id }.tt").hide();
			, 2000)

	$('.tt').mouseleave ->
		id = $(this).attr('id')
		myTimer = setTimeout( -> 
			$("##{ id }.tt").hide();
		, 2000)

