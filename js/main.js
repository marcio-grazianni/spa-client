// JavaScript Document
$( document ).ready(function() {
	
	$(".fsSubmit").removeClass("fsPagination");
	$(".fsPreviousButton").remove();
	$(".fsNextButton").remove();
	// test all possible places hash could be on different browsers
	if(window.location.hash){
	   hash = window.location.hash;
	} else if (document.location.hash){
	   hash = document.location.hash;
	} else if (location.hash){
	   hash = location.hash;
	}
	
	//if there is a hash
	if ('undefined' !== typeof hash) {
		// some browsers start the hash with #, remove it for consistency
		if(hash.substring(0,1) == '#'){
			hash = hash.substring(1,hash.length);
		}
		//if #getInTouch then display Get In Touch Form
		if(hash == 'getInTouch'){
			$('.alpha.getInTouch').show();
		}
		//if #forgot then display forgot Form
		else if(hash == 'forgot'){
			$('.alpha.forgot').show();
		}
	}
	
	//hide email error on click
	$('form[name="emailForm"] .fsPage input.email ').click(function() {
		$('form[name="emailForm"] .fsError').hide();
	});
	
	//show signIn form
	
	//show get in touch form
	$('a.getInTouch').click(function() {
		$('.alpha').hide();
		$('.alpha.getInTouch').show();
	});
	
	//show forgot form
	$('a.forgot').click(function() {
		$('.alpha').hide();
		$('.alpha.forgot').show();
		$(".forgotError").hide();
		
	});
	
	//Hide alpha on Close and reset button value
	$('.alpha .close').click(function() {
		window.location.hash = '';
		$(this).parent('.alpha').hide();
		$('input#fsSubmitButton1656452').val('Join the Waiting List');
	});
	
	
	//On email only form submit show the Get In Touch Form and don't submit if empty
	$("form#fsForm1656XXX").submit(function () {
		$('.alpha').hide();
		$('.alpha.getInTouch').show();
		window.location.hash = '#getInTouch';
		var email = document.forms['emailForm'].field23357957.value;
		if( email == "")
		  {
			return false;
		  }
		else
		  {
			 $('.alpha .fsForm .fsFormatEmail').val(email);
			 return true;
		  }
	});
	
	
	$(".signIn form").submit(function(e) {
		$(".loginError").show();
		e.preventDefault();
	});
	
	$(".forgot form").submit(function(e) {
		$(".forgotError").show();
		e.preventDefault();
	});
	
	
	
	  
	
	

});
