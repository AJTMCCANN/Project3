
//requirement:  on page load, the cursor appears in the "Name" field, ready for a user to type.

$(document).ready(function() {
	$("#name").focus();
});

//"Your job role" text field appears when user selects "Other" from the Job Role menu

$("#other_role").hide().prev().hide();

$("#title").on("change", function() {
	if ($(this).val() === "other") {
		$("#other_role").show().prev().show();  //shows the label too
	} else {
		$("#other_role").hide().prev().hide();  //hides the label too
	};
});

//"Color" drop-down menu is hidden until a T-Shirt design is selected.  T-shirt options are revealed based on the design selcted.  

$("#color").hide().prev().hide();

$("#design").on("change", function() {

	if ($("#design").val() !== "") {
		$($("#color")).show().prev().show() //shows the label too
	}
	else {
		$("#color").hide().prev().hide(); //hides the label too
	}

	if ($("#design").val() === "js puns") {
		$("#color option[value='tomato']").hide();
		$("#color option[value='steelblue']").hide();
		$("#color option[value='dimgrey']").hide();
		$("#color option[value='cornflowerblue']").show();
		$("#color option[value='darkslategrey']").show();
		$("#color option[value='gold']").show();
		$("#color").val("cornflowerblue");				//sets the default value
	} else if ($("#design").val() === "heart js") {
		$("#color option[value='cornflowerblue']").hide();
		$("#color option[value='darkslategrey']").hide();
		$("#color option[value='gold']").hide();
		$("#color option[value='tomato']").show();
		$("#color option[value='steelblue']").show();
		$("#color option[value='dimgrey']").show();
		$("#color").val("tomato");						//set the default value
	}

});


//User cannot select two activities that are at the same time.  Total cost of selected activities is calculated and displayed below the list of activities. 

	// initialize form

$(".activities input[type='radio'][name='first'][value='']").prop("checked", true);
$(".activities input[type='radio'][name='second'][value='']").prop("checked", true);
append_total_cost();

	// bind functions that calculate and display total cost, to the appropriate form elements

function get_total_cost() {

	var sum = 0

	if ($(".activities input[type='checkbox']").prop("checked") === true) {
		sum += 200
	} 

	if ($(".activities input[type='radio'][name='second']:checked").attr("value") !== "") {
		sum += 100
	}

	if ($(".activities input[type='radio'][name='first']:checked").attr("value") !== "") {
		sum += 100
	}

	return sum
}

function append_total_cost() {
	var $cost = $("<h4 class='amount'>$" + get_total_cost() + "</h4>");
	$(".activities .amount").remove();
	$(".activities h4").append($cost);
}

$(".activities input[type='checkbox']").on("change", function () {
	append_total_cost();
});

$(".activities input[type='radio']").on("change", function () {
	append_total_cost();
});


// When a user chooses a payment option, the chosen payment section is revealed and the other payment sections are hidden.

	// initialize default values

$("#credit-card").hide();
$("#paypal").hide()
$("#bitcoin").hide();


$("#payment").on("change", function () {
	if ($(this).val() === "select_method") {
		$("#credit-card").hide();
		$("#paypal").hide()
		$("#bitcoin").hide();
	} else if ($(this).val() === "credit card") {
		$("#credit-card").show();
		$("#paypal").hide()
		$("#bitcoin").hide();
	} else if ($(this).val() === "paypal") {
		$("#credit-card").hide();
		$("#paypal").show()
		$("#bitcoin").hide();
	} else if ($(this).val() === "bitcoin") {
		$("#credit-card").hide();
		$("#paypal").hide()
		$("#bitcoin").show();
	} else if ($(this).val() === "select_method") {
		$("#credit-card").hide();
		$("#paypal").hide()
		$("#bitcoin").hide();
	}
});

// Form cannot be submiited until the following requirements have been met:
//	1. Name field isn't blank
//	2. Email field contains validly formatted email address
//	3. At least one checkbox under "register for Activities" section must be selected
//	4. If "Credit Card" is the selected payment option, the three fields accept only numbers, a 16-digit credit card number, a 5-digit zip code,
//     and a 3-digit CVV

function is_name_field_blank() {
	if ($("#name").val() === "") {
		return true
	} else {
		return false
	}
}

function is_email_format_valid() {
	var valid_email_regex = /.+@.+\..+/
	return valid_email_regex.test($("#mail").val());
}

function is_an_activity_selected() {
	if ($(".activities input[type='checkbox']").is(":checked") || !$(".activities input.none[name='first']").is(":checked") || !$(".activities input.none[name='second']").is(":checked")) {
		$(".activity-error").hide();
		return true;
	} else {
		$(".activity-error").show();
		return false;
	}
}

function is_cc_a_number() {
	var cc_regex = /^\d{16}$/
	return cc_regex.test($("#cc-num").val())
}

function is_zip_a_number() {
	var zip_regex = /^\d{5}$/
	return zip_regex.test($("#zip").val())
}

function is_cvv_a_number() {
	var cvv_regex = /^\d{3}$/
	return cvv_regex.test($("#cvv").val())
}

function basic_info_entered() {
	if (is_an_activity_selected() && is_email_format_valid() && !is_name_field_blank()) {  // these conditions are checked left to right -- their order needs to be 
		return true;																		 // reversed from the order a user typically works through the form
	} else {

		return false;  //more basic info is required
	};
}

function cc_info_copacetic() {
	if ($("#payment").prop("value") === "credit card") {
		if (is_cc_a_number() && is_zip_a_number() && is_cvv_a_number()) {
			return true				//cc info is good
		} else {
			return false		//something wrong with cc info
		};
	} else if (($("#payment").val() === "paypal") || ($("#payment").val() === "bitcoin")) {
		return true				// no cc info needed
	} else {
		 						// default "select payment method" is selected, so do nothing
	}
}

function determine_enabled() {
	if (basic_info_entered() && cc_info_copacetic()) {
		$("#register_btn").prop("disabled", false)
	} else {
		$("#register_btn").prop("disabled", true)
	}
}


// by default the register button is diabled, and the email-format error is hidden

$("#register_btn").prop("disabled", true);
$("#format-error").hide();

// every time one of the form elements changes, the register button may need to be enabled
// also, validation error messages are displayed where appropriate

$("#name").on("input", function () {

	if ($("#name").val() === "") {
		$("#name").next().show()
	} else {
		$("#name").next().hide()
	}

	determine_enabled()
});

$("#mail").on("input", function () {

	if (/.+@.+\..+/.test($("#mail").val())) {
		$("#format-error").hide();
	} else {
		$("#format-error").show();
	}

	if ($("#mail").val() === "") {
		$("#format-error").hide();
		$("#empty-error").show();
	} else {
		$("#empty-error").hide()

	}

	determine_enabled()
});

$(".activities input[type='checkbox']").on("change", function () {
	determine_enabled()
});

$(".activities input[name='first']").on("change", function () {
	determine_enabled()
})

$(".activities input[name='second']").on("change", function () {
	determine_enabled()
})

$("#payment").on("change", function () {
	determine_enabled()
})


$("#cc-num").on("change", function () {

	if (/^\d{16}$/.test($("#cc-num").val())) {
		$("#cc-num").next().hide();
	} else {
		$("#cc-num").next().show();
	}

	determine_enabled()
})


$("#zip").on("change", function () {

	if (/^\d{5}$/.test($("#zip").val())) {
		$("#zip").next().hide();
	} else {
		$("#zip").next().show();
	}

	determine_enabled()
})


$("#cvv").on("change", function () {

	if (/^\d{3}$/.test($("#cvv").val())) {
		$("#cvv").next().hide();
	} else {
		$("#cvv").next().show();
	};

	determine_enabled()
})