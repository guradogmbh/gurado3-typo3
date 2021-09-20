function calculatePrice() {
	$(".data-load-spinner").show();
	var postData = {};
	postData.productId = document.getElementById("pid").value;
	
	var options = new Array();
	var doneOptions = new Array();
	
	var formElements = document.getElementsByClassName("product-options-form")[0].elements;
	
	for (var i = 0; i < formElements.length; i++) {
		var key = formElements[i].name.replace('product_options_', '');
		if(!doneOptions.includes(key)) {
			if(formElements[i].type == 'radio') {
				if($("input[name='product_options_" + key + "']:checked").val()) {
					var tempObj = {"option_id": key, "value": $("input[name='product_options_" + key + "']:checked").val()};
				}
				options.push(tempObj);
				doneOptions.push(key);
			} else if(formElements[i].type == 'checkbox') {
				if($("input[name='product_options_" + key + "']").is(":checked")) {
					var tempObj = {"option_id": key, "value": 1};				
				} else {
					var tempObj = {"option_id": key, "value": 0};
				}
				options.push(tempObj);
				doneOptions.push(key);
			} else if(formElements[i].type == 'select-one') {
				if(formElements[i].value) {
					var tempObj = {"option_id": key, "value": formElements[i].value};
				} else {
					var tempObj = {};
				}
				options.push(tempObj);
				doneOptions.push(key);
			}				
			else {
				if(formElements[i].value) {
					var tempObj = {"option_id": key, "value": formElements[i].value};
				} else {
					var tempObj = {"option_id": key, "value": "empty"};
				}
				options.push(tempObj);
				doneOptions.push(key);
			}
			
		}
	}
	
	postData.options = options;
	
	if(options.length) {
		$.post(
			'index.php',
			{
				eID:'calculate_config_product_price',
				postData: JSON.stringify(postData)
			},
			function(result) {
				if(result.success) {
					if(productDetailsCurrencyCode == 'EUR') {
						var priceFormatted = (Number(result.price)).toLocaleString('de-DE', { style: 'currency', currency: productDetailsCurrencyCode});
					} else {
						var priceFormatted = (Number(result.price)).toLocaleString('en-US', { style: 'currency', currency: productDetailsCurrencyCode});
					}
					
					$(".physical-voucher-form .fixed-price").text(priceFormatted);
					$("#physicalFormVoucherAmount").val(result.price);
					$(".virtual-voucher-form .fixed-price").text(priceFormatted);
					$("#virtualFormVoucherAmount").val(result.price);
					
					$(".data-load-spinner").hide();
				} else {
					alert(result.error);
					$(".data-load-spinner").hide();
				}
			}
		,'json');
	} else {
		$(".data-load-spinner").hide();
	}
}

function addToCart(guradoCart) {
	var addToCartPostData = {};
	addToCartPostData.guradoCart = guradoCart;
	addToCartPostData.sku = document.getElementById("pid").value;
	
	if($("#activeTab").val() == 'emailTab') {
		addToCartPostData.delivery_type = "virtual";
		amount = document.getElementById("virtualFormVoucherAmount").value;
		addToCartPostData.amount = amount.replace(/\s/g, "").replace(",", ".");
		addToCartPostData.qty = $(".virtual-voucher-form .qty-value").text();
		addToCartPostData.virtual_voucher_design_template_id = $(".virtualVoucherTemplateId").val();
		addToCartPostData.deliver_to = $("input[name='deliver_to']:checked").val();
		
		if(allowPersonalizedMessage == 'YES') {
			addToCartPostData.personalized_message = $("textarea[name='virtual_form_personalized_message']").val();
		}
		
		addToCartPostData.delivery_speed = $("input[name='delivery_speed']:checked").val();
		if($("input[name='delivery_speed']:checked").val() == "on_date") {
			var inputDeliveryDate = $("#datepicker").val();
			var inputDeliveryDateArr = inputDeliveryDate.split('.');
			var formattedDeliveryDate = inputDeliveryDateArr[2] + "-" + inputDeliveryDateArr[1] + "-" + inputDeliveryDateArr[0];
			
			addToCartPostData.delivery_date = formattedDeliveryDate;
		}
		
		if($("input[name='deliver_to']:checked").val() == 'someone_else') {
			addToCartPostData.recipient_name = $("input[name='virtual_voucher_recipient_name']").val();
			addToCartPostData.recipient_email_address = $("input[name='virtual_voucher_recipient_email']").val();
		}
		
	} else if($("#activeTab").val() == 'perpostTab') {
		addToCartPostData.delivery_type = "physical";
		amount = document.getElementById("physicalFormVoucherAmount").value;
		addToCartPostData.amount = amount.replace(/\s/g, "").replace(",", ".");
		addToCartPostData.qty = $(".physical-voucher-form .qty-value").text();
		addToCartPostData.physical_voucher_design_template_id = $(".physicalVoucherTemplateId").val();
		
		if(allowPersonalizedMessage == 'YES') {
			addToCartPostData.personalized_message = $("textarea[name='physical_voucher_personalized_message']").val();
		}
		
		addToCartPostData.sender_name = $("input[name='sender_name']").val();
		addToCartPostData.recipient_name = $("input[name='recipient_name']").val();
		
	}
	
	if(productHaveOptions) {
		var options = new Array();
		var doneOptions = new Array();
		
		var formElements = document.getElementsByClassName("product-options-form")[0].elements;
		for (var i = 0; i < formElements.length; i++) {
			var key = formElements[i].name.replace('product_options_', '');
			if(!doneOptions.includes(key)) {
				if(formElements[i].type == 'radio') {
					if($("input[name='product_options_" + key + "']:checked").val()) {
						var tempObj = {"option_id": key, "value": $("input[name='product_options_" + key + "']:checked").val()};
						options.push(tempObj);
						doneOptions.push(key);
					}
				} else if(formElements[i].type == 'checkbox') {
					if($("input[name='product_options_" + key + "']").is(":checked")) {
						var tempObj = {"option_id": key, "value": 1};
						options.push(tempObj);
						doneOptions.push(key);
					}
				} else {
					if(formElements[i].value) {
						var tempObj = {"option_id": key, "value": formElements[i].value};
						options.push(tempObj);
						doneOptions.push(key);
					}
				}
			}
		}
		
		addToCartPostData.options = options;
	}
	
	$.post(
		'index.php',
		{
			eID:'add_product_to_cart',
			postData: JSON.stringify(addToCartPostData)
		},
		function(result) {
			
			if(result.success) {
				var cartCount = Number($(".cart-icon .cart-total").text());
				var newCartCount = cartCount + 1;
				$(".cart-icon .cart-total").text(newCartCount);
				window.location.href = $(".shopping-cart-page").attr("href");
			} else {
				if(result.error_code == 'CART_NOT_FOUND') {
					createCart();
				} else {
					$(".data-load-spinner").hide();
					alert(result.error);
				}
				
			}
		}
	,'json');
}

function createCart() {
	$.post(
		'index.php',
		{
		  eID:'create_cart'
		},
		function(result) {
			if(result.success) {
				localStorage.setItem('guradoCart', result.data.cart);
				addToCart(result.data.cart);
			} else {
				alert(result.error);
			}
			
		}
	,'json');
}

function checkForCart() {
	var proceed = 0;
	var isFormValid = 1;
	var formErrReason = '';
	var isProductOptionsFormValid = 1;
	
	if(productHaveOptions) {
		var forms = document.querySelectorAll('.product-options-form');
		Array.prototype.slice.call(forms)
		.forEach(function (form) {
			if (form.checkValidity()) {
				isProductOptionsFormValid = 1;
			} else {
				isProductOptionsFormValid = 0;
			}

			form.classList.add('was-validated');
		})
	}
	

	if(isProductOptionsFormValid == 1) {
		
		if(priceConfigType == 'range' || priceConfigType == 'RANGE') {
			if($("#activeTab").val() == 'emailTab') {
				var amount = document.getElementById("virtualFormVoucherAmount").value;
				amount = amount.replace(/\s/g, "").replace(",", ".");
			} else if($("#activeTab").val() == 'perpostTab') {
				var amount = document.getElementById("physicalFormVoucherAmount").value;
				amount = amount.replace(/\s/g, "").replace(",", ".");
			}
			
			if(amount != '' && amount >= Number(fromAmount) && Number(amount) <= Number(toAmount)) {
				proceed = 1;
			}
		} else if(priceConfigType == 'dropdown' || priceConfigType == 'DROPDOWN') {
			if($("#activeTab").val() == 'emailTab') {
				var amount = document.getElementById("virtualFormVoucherAmount").value;
				amount = amount.replace(/\s/g, "").replace(",", ".");
			} else if($("#activeTab").val() == 'perpostTab') {
				var amount = document.getElementById("physicalFormVoucherAmount").value;
				amount = amount.replace(/\s/g, "").replace(",", ".");
			}
			
			if(amount != '') {
				proceed = 1;
			}
		} else {
			proceed = 1;
		}
		
		if(proceed == 1) {
			$(".virtual-voucher-form .price-error").hide();
			$(".physical-voucher-form .price-error").hide();
			
			if($("#activeTab").val() == 'emailTab') {
				if($("input[name='delivery_speed']:checked").val() == 'on_date') {
					if(!$("#datepicker").val()) {
						$(".date-error").show();
						isFormValid = 0;
						formErrReason = 'delivery_speed';
					} else {
						$(".date-error").hide();
						isFormValid = 1;
						formErrReason = '';
					}
				}
				
				$(".recipient-name-err").hide();
				$(".recipient-email-err").hide();
				if(isFormValid && $("input[name='deliver_to']:checked").val() == 'someone_else') {
					if($("input[name='virtual_voucher_recipient_name']").val() == '') {
						$(".recipient-name-err").show();
					} else {
						$(".recipient-name-err").hide();
					}
					
					if($("input[name='virtual_voucher_recipient_email']").val() == '') {
						$(".recipient-email-err").show();
					} else {
						var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
						if(emailReg.test($("input[name='virtual_voucher_recipient_email']").val())) {
							$(".recipient-email-err").hide();
						} else {
							$(".recipient-email-err").show();
						}
						
					}
					
					if($("input[name='virtual_voucher_recipient_name']").val() == '' || $("input[name='virtual_voucher_recipient_email']").val() == '') {
						isFormValid = 0;
						formErrReason = 'recipient_details';
					} else {
						var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
						if(emailReg.test($("input[name='virtual_voucher_recipient_email']").val())) {
							isFormValid = 1;
							formErrReason = '';
						} else {
							isFormValid = 0;
							formErrReason = 'recipient_details';
						}
					}
				}
			}
			
			if(isFormValid == 1) {
				$(".price-error").hide();
				$(".data-load-spinner").show();
				if(localStorage.getItem('guradoCart')) {
					var guradoCart = localStorage.getItem('guradoCart');
					addToCart(guradoCart);
				} else {
					createCart();
				}
			} else {
				if($("#activeTab").val() == 'emailTab') {
					var scrollTo = '';
					if(formErrReason == 'delivery_speed') {
						scrollTo = ".delivery-speed-options";
					} else if(formErrReason == 'recipient_details') {
						scrollTo = ".voucher-send-to";
					}
					
					$('html, body').animate({
						scrollTop: $(scrollTo).offset().top
					}, 500);
				}
			}
		} else {
			if($("#activeTab").val() == 'perpostTab') {
				$(".physical-voucher-form .price-error").show();
			} else if($("#activeTab").val() == 'emailTab') {
				$(".virtual-voucher-form .price-error").show();
			}
			
			$('html, body').animate({
				scrollTop: $("#voucherOptionsContent").offset().top
			}, 500);
		}
		
	} else {
		$('html, body').animate({
			scrollTop: $(".product-options-form").offset().top
		}, 500);
	}
}

function selectVirtualVourcherDesign(templateId, templateImg) {
	if($(".virtualVoucherTemplateId").val() != templateId) {
		$(".virtualVoucherTemplateId").val(templateId);
		
		$(".voucher-select .virtual-vouchers span.img").each(function( index ) {
			$(this).removeClass("selected");
		});
		
		$(".voucher-select .virtual-vouchers span.img.template-" + templateId).addClass("selected");
	}
}

function selectPhysicalVourcherDesign(templateId, templateImg) {
	if($(".physicalVoucherTemplateId").val() != templateId) {
		$(".physicalVoucherTemplateId").val(templateId);
		
		$(".voucher-select .physical-vouchers span.img").each(function( index ) {
			$(this).removeClass("selected");
		});
		
		$(".voucher-select .physical-vouchers span.img.template-" + templateId).addClass("selected");
	}
}

function changeCharLimitText(message, tabname) {
	var message = $(message);
	if (!message) {
		return;
	}
	
	var maxLength = $(message).attr("maxlength");
	var remaining = maxLength - $(message).val().length;
	if(tabname == 'emailTab') {
		$('.virtual-voucher-form .remaining-chars').text(remaining);
	} else if(tabname == 'perpostTab') {
		$('.physical-voucher-form .remaining-chars').text(remaining);
	}
	
}

function updateVoucherItemQty(action, parentElem) {
	var qtyToChange = Number($("." + parentElem + " .qty-value").text());
	if(action == 'increase') {
		if(qtyToChange < 5)
			$("." + parentElem + " .qty-value").text(qtyToChange + 1);
	} else if(action == 'decrease') {
		if(qtyToChange > 1)
			$("." + parentElem + " .qty-value").text(qtyToChange - 1);
	}
}

function collapseDiv() {
	$(".collapse-div").slideToggle(300, function () {
        if($(".collapse-div").is(":visible")) {
			$(".collapse-btn span.up").show();
			$(".collapse-btn span.down").hide();
		} else {
			$(".collapse-btn span.up").hide();
			$(".collapse-btn span.down").show();
		}
    });
}

function setGoogleAddressToShipping() {
	var autocomplete = new google.maps.places.Autocomplete($("#shipping_street")[0], {
		componentRestrictions: { country: ["de", "be", "dk", "fr", "it", "lu", "nl", "pl", "ch", "cz", "at"] },
		fields: ["address_components", "geometry"],
		types: ["address"],
	});
	
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		var place = autocomplete.getPlace();
		let postcode = "";


		for (const component of place.address_components) {
			const componentType = component.types[0];
			switch (componentType) {
				case "street_number": {
					document.querySelector("#shipping_house_number").value = component.long_name;
					break;
				}

				case "route": {
					document.querySelector("#shipping_street").value = component.short_name;
					break;
				}

				case "postal_code": {
					postcode += component.long_name;
					break;
				}

				case "postal_code_suffix": {
					postcode += '-' + component.long_name;
					break;
				}
				
				case "locality":
					document.querySelector("#shipping_city").value = component.long_name;
					break;

				case "administrative_area_level_1": {
					break;
				}
				
				case "country":
					document.querySelector("#shipping_country").value = component.short_name;
					break;

			}
		}
		
		document.querySelector("#shipping_postcode").value = postcode;
	});
}

function slideCarousel(ev, voucherType, action) {
	ev.preventDefault();
	$("#" + voucherType).carousel(action);
}


$(document).ready(function() {
	var timer;

	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	  return new bootstrap.Tooltip(tooltipTriggerEl)
	});
	
	if($('.gurado-storefront-productlist').length) {
		$(".pagination li a").each(function( index ) {
			if(Number($(this).attr("data-page")) == 1) {
				$(this).attr("href", $(".product-list").attr("href"));
			} else {
				$(this).attr("href", $(".product-list").attr("href") + "?page=" + $(this).attr("data-page"));
			}
		});
		
		timer = setTimeout(function(){ 
			$(".card-img-top").each(function( index ) {
				$(this).removeClass("loading");
			});
			clearTimeout(timer);
		}, 1000);		
	}
	
	if($('.gurado-storefront-productdetails').length) {
		var today = new Date();
		var tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);

		jQuery(function($){
			$.datepicker.regional['de'] = {
				closeText: 'schließen', closeStatus: '',
				prevText: '&#x3c;zurück', prevStatus: '',
				nextText: 'Vor&#x3e;', nextStatus: '',
				currentText: 'heute', currentStatus: '',
				monthNames: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
				monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
				dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
				dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
				dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
				weekHeader: '',
				dateFormat:'dd.mm.yy',
				firstDay: 1,
				isRTL: false,
				showMonthAfterYear: false,
				yearSuffix: '',
				minDate: tomorrow,
				maxDate: '+12M +0D',
				showButtonPanel: true
			};
			$.datepicker.setDefaults($.datepicker.regional['de']);
		});
		$.datepicker.setDefaults( $.datepicker.regional[ "de" ] );
		
		$("#datepicker").datepicker();

		$('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (event) {
		  /*event.target // newly activated tab
		  event.relatedTarget // previous active tab*/
			if($(event.target).attr("id") == 'perpostTab') {
				document.getElementById("activeTab").value = 'perpostTab';
				$(".virtual-vouchers").hide();
				$(".physical-vouchers").show();
				$(".perpost-note").show();
				
				if(priceConfigType == 'range' || priceConfigType == 'RANGE')
					$("#virtualFormVoucherAmount").val('');
				
				$(".virtual-voucher-form .price-error").hide();
				$("input[name='virtual_voucher_recipient_name']").val('');
				$("input[name='virtual_voucher_recipient_email']").val('');
				$("textarea[name='virtual_form_personalized_message']").val('');
				$("#datepicker").val('');
				$(".recipient-name-err").hide();
				$(".recipient-email-err").hide();
			} else if($(event.target).attr("id") == 'emailTab') {
				document.getElementById("activeTab").value = 'emailTab';
				$(".physical-vouchers").hide();
				$(".virtual-vouchers").show();
				$(".perpost-note").hide();
				
				if(priceConfigType == 'range' || priceConfigType == 'RANGE')
					$("#physicalFormVoucherAmount").val('');
				
				$(".physical-voucher-form .price-error").hide();
				$("input[name='sender_name']").val('');
				$("input[name='recipient_name']").val('');
				$("textarea[name='physical_voucher_personalized_message']").val('');
			}
		});
		
		var delivery_speed_radio_btns = document.virtualForm.delivery_speed;
		for (var i = 0; i < delivery_speed_radio_btns.length; i++) {
			delivery_speed_radio_btns[i].addEventListener('change', function() {
				if(this.value == "on_date") {
					$(".datepicker-container").show();
				} else {
					$(".datepicker-container").hide();
					$('#datepicker').datepicker('setDate', null);
				}
			});
		}
		
		var deliver_to_radio_btns = document.virtualForm.deliver_to;
		for (var i = 0; i < deliver_to_radio_btns.length; i++) {
			deliver_to_radio_btns[i].addEventListener('change', function() {
				if(this.value == "someone_else") {
					$(".virtual-voucher-to-other").show();
					$(".virtual-voucher-to-other input").prop('required',true);
					$(".delivery-speed-options").show();
				} else {
					$(".virtual-voucher-to-other").hide();
					$(".virtual-voucher-to-other input").prop('required',false);
					$(".recipient-name-err").hide();
					$(".recipient-email-err").hide();
					$(".delivery-speed-options").hide();
				}
			});
		}
		
		if(productHaveOptions) {
			var elements = document.querySelectorAll('.product-options .form-control, .product-options .form-check-input');
			Array.from(elements).forEach((element, index) => {
				if(element.getAttribute("data-required") == 'YES') {
					element.setAttribute("required", '');
				}
			});
			
			calculatePrice();
			
			$('.product-options-form input[type=radio]').change(function() {
				calculatePrice();
			});
		}

	}
	
	if($("#billing_street").length) {
		if(localStorage.getItem('guradoCart')) {
			var autocomplete = new google.maps.places.Autocomplete($("#billing_street")[0], {
				componentRestrictions: { country: ["de", "be", "dk", "fr", "it", "lu", "nl", "pl", "ch", "cz", "at"] },
				fields: ["address_components", "geometry"],
				types: ["address"],
			});
			
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				var place = autocomplete.getPlace();
				let postcode = "";


				for (const component of place.address_components) {
					const componentType = component.types[0];
					switch (componentType) {
						case "street_number": {
							document.querySelector("#billing_house_number").value = component.long_name;
							break;
						}

						case "route": {
							document.querySelector("#billing_street").value = component.short_name;
							break;
						}

						case "postal_code": {
							postcode += component.long_name;
							break;
						}

						case "postal_code_suffix": {
							postcode += '-' + component.long_name;
							break;
						}
						
						case "locality":
							document.querySelector("#billing_city").value = component.long_name;
							break;

						case "administrative_area_level_1": {
							break;
						}
						
						case "country":
							document.querySelector("#billing_country").value = component.short_name;
							break;

					}
				}
				
				document.querySelector("#billing_postcode").value = postcode;
			});
		}
	}
	
});