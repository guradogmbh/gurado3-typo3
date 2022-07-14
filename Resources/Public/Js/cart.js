function setCartIconCount(guradoCart) {
	var parameters = {};
	parameters.guradoCart = guradoCart;
	
	$.post(
		'index.php',
		{
			eID:'cart',
			parameters: JSON.stringify(parameters)
		},
		function(result) {
			if(result && result.success) {
				var cartItems = result.data.items;
				if(cartItems.length > 0) {
					$(".cart-icon .cart-total").text(cartItems.length);
					$(".cart-icon").show();
				} else {
					$(".cart-icon").hide();
				}
			} else {
				
			}
		}
	,'json');
}

function displayCart(guradoCart) {
	var parameters = {};
	parameters.guradoCart = guradoCart;
	$(".data-load-spinner").show();
	
	$.post(
		'index.php',
		{
			eID:'cart',
			parameters: JSON.stringify(parameters)
		},
		function(result) {
			if(result.success) {
				var cartItems = result.data.items;
				var desktopCart = '';
				var mobileCart = '';
				var summary = '';
				var cartCouponCode = '';

				
				if($(".cart-icon .cart-total").length) {
					if(cartItems.length > 0) {
						$(".cart-icon .cart-total").text(cartItems.length);
						$(".cart-icon").show();
					} else {
						$(".cart-icon").hide();
					}
				}
				
				if(cartItems.length) {
					if($('.gurado-storefront-payment').length) {
						if(result.data.billing_address) {
							loadPaymentJs();
							
							var guradoBillingAddress = result.data.billing_address;
							var billingAddressText = '';

							billingAddressText += guradoBillingAddress['firstname'] + ' ';
							billingAddressText += guradoBillingAddress['lastname'] + '<br />';
							billingAddressText += result.data.guest.email_address + '<br />';
							
							billingAddressText += guradoBillingAddress['street'] + ' ';
							billingAddressText += guradoBillingAddress['house_number'] + '<br />';
							
							billingAddressText += guradoBillingAddress['postcode'] + ' ';
							billingAddressText += guradoBillingAddress['city'] + '<br />';
							
							$("select.billing-addr-countries-select").val(guradoBillingAddress['country_code']);
								billingAddressText += $("select.billing-addr-countries-select option:selected").text() + '<br />';
							if(guradoBillingAddress['phone_number'])
								billingAddressText += guradoBillingAddress['phone_number'] + '<br />';
							
							$('.billingAddressText').html(billingAddressText);
							
							if(result.data.requires_shipping && result.data.shipping_address) {
								$(".gurado-storefront-payment .order-summary").addClass("have-shipping");
								$(".billing-address").addClass("d-mb-40 m-mb-30");
								if(guradoBillingAddress['use_for_shipping']) {
									
								} else {
									
									var shippingAddressText = '';
									var guradoShippingAddress = result.data.shipping_address;
									
									shippingAddressText += guradoShippingAddress['firstname'] + ' ';
									shippingAddressText += guradoShippingAddress['lastname'] + '<br />';
									
									shippingAddressText += guradoShippingAddress['street'] + ' ';
									shippingAddressText += guradoShippingAddress['house_number'] + '<br />';
									
									shippingAddressText += guradoShippingAddress['postcode'] + ' ';
									shippingAddressText += guradoShippingAddress['city'] + '<br />';
									
									$("select.shipping-addr-countries-select").val(guradoShippingAddress['country_code']);
										shippingAddressText += $("select.shipping-addr-countries-select option:selected").text() + '<br />';
									if(guradoShippingAddress['phone_number'])
										shippingAddressText += guradoShippingAddress['phone_number'];
									
									$(".shipping-address-block .billingAddressText").html(shippingAddressText);
								}
							} else {
								$(".gurado-storefront-payment .order-summary").removeClass("have-shipping");
								$(".billing-address").removeClass("d-mb-40 m-mb-30");
								$(".shipping-address-heading").hide();
								$(".shipping-address-block").hide();
							}
						} else {
							window.location.href = $(".checkout-page").attr("href");
						}
					}

					if($('.gurado-storefront-checkout').length) {
						if(result.data.requires_agreement_acceptance) {
							$(".terms-and-conditions .form-check-input").show();
							$(".requires-agreement-acceptance").val(1);
							$(".terms-and-conditions .terms-and-conditions-label").hide();
						} else {
							$(".terms-and-conditions .form-check-input").hide();
							$(".requires-agreement-acceptance").val('');
							$(".terms-and-conditions .form-check").addClass("no-checkbox");
							$(".terms-and-conditions .terms-and-conditions-label").show();
						}
						
						if(result.data.requires_shipping) {
							$(".requires-shipping").val(1);
							setGoogleAddressToShipping();
						} else {
							$(".is-billing-shipping-checkbox").hide();
							$(".requires-shipping").val(0);
						}
						
						if(result.data.guest && result.data.guest.email_address)
							$("input[name='email_address']").val(result.data.guest.email_address);
						
						if(result.data.billing_address) {
							$("input[name='firstname']").val(result.data.billing_address.firstname);
							$("input[name='lastname']").val(result.data.billing_address.lastname);
							$("input[name='street']").val(result.data.billing_address.street);
							$("input[name='house_number']").val(result.data.billing_address.house_number);
							$("input[name='postcode']").val(result.data.billing_address.postcode);
							$("input[name='city']").val(result.data.billing_address.city);
							$("select[name='country_code']").val(result.data.billing_address.country_code);
							
							if(result.data.billing_address.company_name)
								$("input[name='company_name']").val(result.data.billing_address.company_name);
							if(result.data.billing_address.phone_number)
								$("input[name='phone_number']").val(result.data.billing_address.phone_number);
							if(result.data.billing_address.vat_number)
								$("input[name='vat_number']").val(result.data.billing_address.vat_number);
							
							if(result.data.billing_address.company_name || result.data.billing_address.vat_number) {
								$('#add_company_data_for_billing').prop('checked', true);
								$(".billing .company-details-container").show();
							}
							
							if(result.data.requires_agreement_acceptance) {
								$(".terms-and-conditions .form-check-input").prop('checked', true);
							}
							
							if(result.data.billing_address.use_for_shipping) {
								$('#is_billing_shipping_same').prop('checked', true);
								$(".shipping-address-block").hide();
								$(".shipping-address-block .form-control.is-required").removeAttr('required');
								$(".shipping-address-block .mandatory-err").removeClass("invalid-feedback");
							} else {
								if(result.data.requires_shipping) {
									$('#is_billing_shipping_same').prop('checked', false);
									$(".shipping-address-block").show();
									$(".shipping-address-block .form-control.is-required").prop("required", true);
									$(".shipping-address-block .mandatory-err").addClass("invalid-feedback");
								}
							}
						}
						
						if(result.data.shipping_address) {
							$("input[name='shipping_firstname']").val(result.data.shipping_address.firstname);
							$("input[name='shipping_lastname']").val(result.data.shipping_address.lastname);
							$("input[name='shipping_street']").val(result.data.shipping_address.street);
							$("input[name='shipping_house_number']").val(result.data.shipping_address.house_number);
							$("input[name='shipping_postcode']").val(result.data.shipping_address.postcode);
							$("input[name='shipping_city']").val(result.data.shipping_address.city);
							$("select[name='shipping_country_code']").val(result.data.shipping_address.country_code);
							
							if(result.data.shipping_address.company_name) {
								$("input[name='shipping_company_name']").val(result.data.shipping_address.company_name);
								$('#add_company_data_for_shipping').prop('checked', true);
								$(".shipping .company-details-container").show();
							}
							
							if(result.data.shipping_address.phone_number)
								$("input[name='shipping_phone_number']").val(result.data.shipping_address.phone_number);
						}
						
					}
					
					desktopCart += '<div class="row heading"><div class="col-md-5 cell first">' + $(".voucher-label").text() + '</div><div class="text-center col-md-2 cell second">&nbsp;</div><div class="text-right text-end col-md-4 cell">' + $(".unit-price-label").text() + '</div><div class="text-right text-end col-md-1 cell">' + $(".row-total-label").text() + '</div></div>';
					
					for(var i in cartItems) {	
						var cartItemLocaleString = 'de-DE';
						
						if(result.data.currency_code == 'EUR') {
							cartItemLocaleString = 'de-DE';
							var priceFormatted = (cartItems[i]['unit_price']).toLocaleString('de-DE', { style: 'currency', currency: result.data.currency_code});
							var totalFormatted = (cartItems[i]['row_total']).toLocaleString('de-DE', { style: 'currency', currency: result.data.currency_code});
						} else {
							cartItemLocaleString = 'en-US';
							var priceFormatted = (cartItems[i]['unit_price']).toLocaleString('en-US', { style: 'currency', currency: result.data.currency_code});
							var totalFormatted = (cartItems[i]['row_total']).toLocaleString('en-US', { style: 'currency', currency: result.data.currency_code});
						}
						
						var addOnsUnitPrice = '';
						var addOnsRowTotal = '';
						if(cartItems[i]['add_ons'] && cartItems[i]['add_ons'].length) {
							addOnsUnitPrice += '<div class="unit-price-addons">';
							addOnsRowTotal += '<div class="row-total-addons">';
							for(var z = 0; z < cartItems[i]['add_ons'].length; z++) {
								
								if(z > 0) {
									addOnsUnitPrice += '<br/>';
									addOnsRowTotal += '<br/>';
								}
								
								addOnsUnitPrice += '<span class="text-label font-bold">zzgl. ' + cartItems[i]['add_ons'][z].name + '</span><span class="price">' + (cartItems[i]['add_ons'][z].unit_price).toLocaleString(cartItemLocaleString, { style: 'currency', currency: result.data.currency_code}) + '</span>';
								
								addOnsRowTotal += (cartItems[i]['add_ons'][z].row_total).toLocaleString(cartItemLocaleString, { style: 'currency', currency: result.data.currency_code});
	
							}
							addOnsUnitPrice += '</div>';
							addOnsRowTotal += '</div>';
						}
												
						desktopCart += '<div class="row product-row">'
						  + '<div class="col-md-5 cell first"><h5 class="mb-2">' + cartItems[i]['name'] + '</h5><img src="'+ cartItems[i]['voucher_design_template']['thumbnail_url'] + '" /></div>' 
						  + "<div class='col-md-3 col-lg-2 text-center update-cart-item cell second'><div class='actions'>" + generateQtyHtml(cartItems[i]['qty'], cartItems[i]['item_id']) + "<a onclick='updateItemQty(" + cartItems[i]['item_id'] + ", this)' href='javascript:' class='update-cart-btn' style='display: none;'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-clockwise' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/><path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/></svg>&nbsp;" + $(".update-label").text() + "</a><a class='delete-cart-item' href='javascript:' onclick='deleteItemFromCart(" + cartItems[i]['item_id'] + ")'><img src='typo3conf/ext/gurado_storefront/Resources/Public/bootstrap-icons/trash.svg' />&nbsp;" + $(".remove-label").text() + "</a></div></div>"
						  + '<div class="text-right text-end col-md-4 cell">' + priceFormatted + addOnsUnitPrice + "</div>"
						  + "<div class='col-md-1 text-right text-end cell row-total'>" + totalFormatted + addOnsRowTotal + "</div>"
						  +  "</div>";

						
						if($('.gurado-storefront-checkout').length || $('.gurado-storefront-payment').length) {
							
							var addOnsText = '';
							if(cartItems[i]['add_ons'] && cartItems[i]['add_ons'].length) {
								addOnsText += '<div class="cart-column addons">';
								for(var z = 0; z < cartItems[i]['add_ons'].length; z++) {

									addOnsText += '<div><span class="addons-label">zzgl. ' + cartItems[i]['add_ons'][z].name + '<span class="only-mobile">:</span></span><span class="addons-total">' + (cartItems[i]['add_ons'][z].row_total).toLocaleString(cartItemLocaleString, { style: 'currency', currency: result.data.currency_code}) + '</span></div>';
											
								}
								addOnsText += '</div>';
							}
							
							mobileCart += '<div class="row cart-row">'
								+ '<span class="voucher-img"><img src="' + cartItems[i]['voucher_design_template']['thumbnail_url'] + '" /></span>'
								+ '<div class="details"><div class="name">' + cartItems[i]['name'] + '</div><span>' + $("div.quantity-label").text() + ':&nbsp;' + cartItems[i]['qty'] + '</span></div>'
								+ '<span class="total-price">' + totalFormatted + '</span>'
								+ addOnsText
								+ '</div>';
						} else {
							
							var addOnsText = '';
							if(cartItems[i]['add_ons'] && cartItems[i]['add_ons'].length) {
								addOnsText += '<div class="addons">';
								for(var z = 0; z < cartItems[i]['add_ons'].length; z++) {

									addOnsText += '<div><span class="addons-label font-bold">zzgl. ' + cartItems[i]['add_ons'][z].name + '</span><span class="addons-total">' + (cartItems[i]['add_ons'][z].row_total).toLocaleString(cartItemLocaleString, { style: 'currency', currency: result.data.currency_code}) + '</span></div>';
											
								}
								addOnsText += '</div>';
							}
							
							mobileCart += '<div class="row mobile-cart-row">'
								+ '<a class="delete-cart-item" href="javascript:" onclick="deleteItemFromCart(' + cartItems[i]['item_id'] + ')"><img src="typo3conf/ext/gurado_storefront/Resources/Public/bootstrap-icons/trash.svg" /></a>'
								+ '<span class="voucher-img"><img src="' + cartItems[i]['voucher_design_template']['thumbnail_url'] + '" /></span>'
								+ '<div class="details">'
								+ '<div class="name">' + cartItems[i]['name'] + '</div>'
								+ '<div class="unit-price">' + priceFormatted + '</div>'
								+ '</div>'
								+ '<div class="total-row">'
								+ "<span class='actions'>" + generateQtyHtml(cartItems[i]['qty'], cartItems[i]['item_id']) + "<a onclick='updateItemQty(" + cartItems[i]['item_id'] + ", this)' href='javascript:' class='update-cart-btn' style='display: none; margin-right: 15px;'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-clockwise' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z'/><path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z'/></svg>&nbsp;" + $(".update-label").text() + "</a>"
								+ '</span>'
								+ '<span class="total-price">' + totalFormatted + '</span>'
								+ '</div>'
								+ addOnsText
								+ '</div>';
							
						}
						

					}
					
					if($('#cartTable').length)
						$('#cartTable').html(desktopCart);
					
					if($('#cartTableMobile').length)
						$('#cartTableMobile').html(mobileCart);
					
					var taxPercentage = '';
					var taxCurrency = '';
					if(result.data.currency_code == 'EUR') {
						taxCurrency = 'de-DE';
					} else {
						taxCurrency = 'en-US';
					}
					for(var i = 0; i < result.data.taxes.length; i++) {
						var taxInluExcluLabel = '';
						if(result.data.taxes[i].is_included_in_price == 'YES') {
							taxInluExcluLabel = $(".tax-label-inlcuding").text();
						} else {
							taxInluExcluLabel = $(".tax-label-exlcuding").text();
						}
						taxPercentage += '<div class="summary-row text-right text-end"><div class="summary-label mb-0">' + taxInluExcluLabel + ' (MwSt. ' + result.data.taxes[i].rate + '%)' + '</div><div class="summary-value mb-0">' + (result.data.taxes[i].amount).toLocaleString(taxCurrency, { style: 'currency', currency: result.data.currency_code}) + '</div></div>';
					}
				
					summary += '<div class="row"><div class="col-sm-12">';
					if(result.data.currency_code == 'EUR') {
						summary += '<div class="summary-row text-right text-end"><div class="summary-label mb-0">' + $(".subtotal-label").text() + '</div><div class="summary-value mb-0">' + (result.data.subtotal).toLocaleString('de-DE', { style: 'currency', currency: result.data.currency_code}) + '</div></div>';
						
						summary += taxPercentage;

						if(result.data && result.data.redemptions && result.data.redemptions.length > 0) { 

							summary += '<div class="summary-row total text-right text-end"><div class="summary-label mb-0 font-bold">' + $(".coupon-label").text() +'(' + result.data.redemptions[0].code+')' + '</div><div class="summary-value mb-0 font-bold">' + (result.data.total_redemption_amount).toLocaleString('de-DE', { style: 'currency', currency: result.data.currency_code}) + '</div></div>';
						}
						
						summary += '<div class="summary-row total text-right text-end"><div class="summary-label mb-0 font-bold">' + $(".total-label").text() + '</div><div class="summary-value mb-0 font-bold">' + (result.data.grand_total).toLocaleString('de-DE', { style: 'currency', currency: result.data.currency_code}) + '</div></div>';
						
						$(".total-to-pay span").text((result.data.grand_total).toLocaleString('de-DE', { style: 'currency', currency: result.data.currency_code}));
					} else {
						summary += '<div class="summary-row text-right text-end"><div class="summary-label mb-0">' + $(".subtotal-label").text() + '</div><div class="summary-value mb-0">' + (result.data.subtotal).toLocaleString('en-US', { style: 'currency', currency: result.data.currency_code}) + '</div></div>';
						
						summary += taxPercentage;

						if(result.data && result.data.redemptions && result.data.redemptions.length > 0) { 
							summary += '<div class="summary-row total text-right text-end"><div class="summary-label mb-0 font-bold">' + $(".coupon-label").text() +'(' + result.data.redemptions[0].code+')' + '</div><div class="summary-value mb-0 font-bold">' + (result.data.total_redemption_amount).toLocaleString('de-DE', { style: 'currency', currency: result.data.currency_code}) + '</div></div>';
						}

						
						summary += '<div class="summary-row total text-right text-end"><div class="summary-label mb-0">' + $(".total-label").text() + '</div><div class="summary-value mb-0">' + (result.data.grand_total).toLocaleString('en-US', { style: 'currency', currency: result.data.currency_code}) + '</div></div>';
						
						$(".total-to-pay span").text((result.data.grand_total).toLocaleString('en-US', { style: 'currency', currency: result.data.currency_code}));
					}
					summary += '</div></div>';

					if( result.data && result.data.can_apply_redemption == 'YES') { 
						$("#coupon_code").prop('disabled', false);  
						cartCouponCode += '<div class="row"><div class="col-sm-12">';
						cartCouponCode += '<form class="discount-form" novalidate> <label class="block-heading pt-0">' +  $(".coupon-code").text()+ '</label><label>'+ $(".coupon-code-information").text()+'</label>';  
						if(result.data.redemptions && result.data.redemptions.length == 0)  {
							cartCouponCode +='<input type="text" id="coupon_code" value=""  class="form-control form-field" name="coupon_code" />';
							cartCouponCode +='<a type="submit" class="btn btn-primary m-w-100 mt-5" href="javascript:" onclick="redeem(event)">'+$(".redeem-discount-code").text()+'</a> </form>';  
						}
						if(result.data.redemptions && result.data.redemptions.length > 0) { 
							cartCouponCode +='<input type="text" id="coupon_code" value="' + result.data.redemptions[0].code + '" disabled = "false" class="form-control form-field" name="coupon_code" />';
							cartCouponCode +='<a type="submit" class="btn btn-primary m-w-100 mt-5" href="javascript:" onclick="deleteCouponCode(' + result.data.redemptions[0].redemption_id + ')">'+$(".delete-discount-code").text()+'</a> </form>';  
						}
						
					cartCouponCode += '</div></div>';
					}
					
					if($('#cartTableMobile').length)
						$('.cartSummary').html(summary);

					if( result.data && result.data.can_apply_redemption == 'YES') {  
						$('.gurado-storefront .cartCouponCode').html(cartCouponCode);
					}
					
					$(".have-cart-items").show();
					$(".no-cart").hide();
					$(".data-load-spinner").hide();

				} else {
					if($('.gurado-storefront-checkout').length || $('.gurado-storefront-payment').length) {
						window.location.href = $(".list-page").attr("href");
					} else {
						$(".data-load-spinner").hide();
						$(".have-cart-items").hide();
						$(".no-cart").show();
					}
				}
				
			} else {
				if($('.gurado-storefront-checkout').length || $('.gurado-storefront-payment').length) {
					window.location.href = $(".list-page").attr("href");
				} else {
					if(result.error_code == 'CART_NOT_FOUND') {
						$(".data-load-spinner").hide();
						$(".have-cart-items").hide();
						$(".no-cart").show();
					} else {
						$(".data-load-spinner").hide();
						$(".have-cart-items").hide();
						$(".no-cart").show();
						alert($(".process-error-message").text());
					}
				}
			}
		}
	,'json');
}

function redeem(event){
	event.preventDefault();
	console.log("the event is=>",event);
	var couponCode = document.getElementById('coupon_code').value;
	console.log("the coupon code is as follow=>",couponCode); 

	$(".gurado-storefront .data-load-spinner").show();
	var parameters = {};
	var guradoCart = localStorage.getItem('guradoCart');
	console.log("the guradoCart is as follow=>",guradoCart);  

	parameters.code = couponCode;
	parameters.guradoCart = guradoCart;

	
	$.post(
		'index.php',
		{
			eID:'create_cart_redemption',
			parameters: JSON.stringify(parameters)
		},
		function(result) {
			if(result.success) {
				displayDeleteButton = true;
				displayCart(guradoCart);
			} else {
				displayDeleteButton = false;
				$(".gurado-storefront .data-load-spinner").hide(); 
				alert($(".invalid-redemption-code").text());
			}
		}
	,'json');

}

function deleteCouponCode(redemptionId){
	console.log("the event is=>",redemptionId); 
	$(".gurado-storefront .data-load-spinner").show();
	var parameters = {};
	var guradoCart = localStorage.getItem('guradoCart');
	console.log("the guradoCart is as follow=>",guradoCart);  

	parameters.redemption_id = redemptionId;
	parameters.guradoCart = guradoCart;

	$.post(
		'index.php',
		{
			eID:'delete_cart_redemption',
			parameters: JSON.stringify(parameters) 
		},
		function(result) {
			if(result.success) {
				displayDeleteButton = true;
				$("#coupon_code").prop('disabled', false);  
				$(".gurado-storefront input[name='coupon_code']").val('');  
				displayCart(guradoCart);
			} else {
				displayDeleteButton = false;
				$(".gurado-storefront .data-load-spinner").hide(); 
				alert($(".process-error-message").text());
			}
		}
	,'json');

} 

function updateCartItemQty(action, elem) {
	var qtyToChange = Number($(elem).parent(".qty-container").find(".qty-value").text());
	
	if(action == 'increase') {
		if(qtyToChange < 5) {
			$(elem).parent(".qty-container").find(".qty-value").text(qtyToChange + 1);
			$(elem).parent(".qty-container").parent(".actions").find(".update-cart-btn").show();
			$(elem).parent(".qty-container").parent(".actions").find(".delete-cart-item").addClass("mt-0");
		}
	} else if(action == 'decrease') {
		if(qtyToChange > 1) {
			$(elem).parent(".qty-container").find(".qty-value").text(qtyToChange - 1);
			$(elem).parent(".qty-container").parent(".actions").find(".update-cart-btn").show();
			$(elem).parent(".qty-container").parent(".actions").find(".delete-cart-item").addClass("mt-0");
		}
	}
}

function generateQtyHtml(selectedValue, itemId) {
	var returnStr = "";
	
	returnStr += '<span class="qty-container">';
	
	returnStr += '<span class="qty-action-btn" onclick="updateCartItemQty(\'decrease\', this)">-</span>';
	returnStr += '<span class="qty-value">' + selectedValue + '</span>';
	returnStr += '<span class="qty-action-btn" onclick="updateCartItemQty(\'increase\', this)">+</span>';
	
	returnStr += '</span>';
	
	return returnStr;
}

function deleteItemFromCart(itemId) {
	$(".data-load-spinner").show();
	var parameters = {};
	var guradoCart = localStorage.getItem('guradoCart');
	parameters.guradoCart = guradoCart;
	parameters.itemId = itemId;
	
	$.post(
		'index.php',
		{
			eID:'delete_cart_item',
			parameters: JSON.stringify(parameters)
		},
		function(result) {
			if(result.success) {
				displayCart(guradoCart);
			} else {
				$(".data-load-spinner").hide();
				alert($(".process-error-message").text());
			}
		}
	,'json');
}

function updateItemQty(itemId, elem) {
	var qtyToChange = Number($(elem).parent(".actions").find(".qty-container .qty-value").text());
	$(".data-load-spinner").show();
	var parameters = {};
	var guradoCart = localStorage.getItem('guradoCart');
	parameters.guradoCart = guradoCart;
	parameters.itemId = itemId;
	parameters.qty = qtyToChange;
	
	$.post(
		'index.php',
		{
			eID:'update_cart_item_qty',
			parameters: JSON.stringify(parameters)
		},
		function(result) {
			if(result.success) {
				displayCart(guradoCart);
			} else {
				$(".data-load-spinner").hide();
				alert($(".process-error-message").text());
			}
		}
	,'json');
}

function loadPaymentJs() {	
	var payment_js_load = document.createElement('script');
	$("#gurado-payments-container").before(payment_js_load);
	
	payment_js_load.onload = function() {
		$("#gurado-payments-container").after( '<script nonce="">' +
											'gurado.Payments({onComplete:function() {onPaymentComplete();}, onError:function() {onPaymentError();}}).render("#gurado-payments-container");' + 
											'</script>'
		);
	}
	payment_js_load.onerror = function() {
		console.log("payment error");
	}
	payment_js_load.src = "https://storefront.gurado.de/payments-sdk/js?client_id=" + clientId + "&cart_id=" + localStorage.getItem('guradoCart');
	payment_js_load.setAttribute('nonce',""); 

}

function onPaymentComplete() {
	window.location.href = $(".order-success-page").attr("href");
}

function onPaymentError() {
	alert($(".process-error-message").text());
}

function proceedToPayment(ev) {
	ev.preventDefault();
	
	var forms = document.querySelectorAll('.checkout-form');
	Array.prototype.slice.call(forms)
	.forEach(function (form) {
		if (form.checkValidity()) {
			form.classList.remove('was-validated');
			
			var termsAccepted = 1;
			var callAgreementApi = 0;
			$(".checkbox-mandatory-error").hide();
			
			if($(".requires-agreement-acceptance").val()) {
				var callAgreementApi = 1;
				$('.terms-and-conditions .form-check-input').each(function () {
					if(!this.checked) {
						termsAccepted = 0;
					}
				});
			}
			
			if(termsAccepted == 0)
				$(".checkbox-mandatory-error").show();
			
			if(termsAccepted) {
				var parameters = {};
				$(".data-load-spinner").show();
				var formElements = document.getElementsByClassName("checkout-form")[0].elements;
				var guradoCart = localStorage.getItem('guradoCart');
				parameters.guradoCart = guradoCart;
				
				for (var i = 0; i < formElements.length; i++) {
					if (formElements[i].type != "submit" && formElements[i].value) {
						parameters[formElements[i].name] = formElements[i].value;
					}
				}
				
				if($("input[name='is_billing_shipping_same']").is(":checked")) {
					parameters.isShippingAndBillingSame = 1;
				} else {
					parameters.isShippingAndBillingSame = 0;
				}
								
				$.post(
					'index.php',
					{
						eID:'checkout',
						parameters: JSON.stringify(parameters)
					},
					function(result) {
						if(result.success) {
							if(callAgreementApi) {
								
								var agreementParams = {};
								$('.terms-and-conditions .form-check-input').each(function () {
									agreementParams[this.value] = this.value;
								});
								
								var guradoCart = localStorage.getItem('guradoCart');
								agreementParams.guradoCart = guradoCart;
								
								$.post(
									'index.php',
									{
										eID:'set_agreements',
										parameters: JSON.stringify(agreementParams)
									},
									function(result) {
										if(result.success) {
											window.location.href = $(".payment-page").attr("href");
										} else {
											$(".data-load-spinner").hide();
											console.log(result.responseCode);
											alert($(".process-error-message").text());
										}
									}
								,'json');
								
							} else {
								window.location.href = $(".payment-page").attr("href");
							}
						} else {
							$(".data-load-spinner").hide();
							alert($(".process-error-message").text());
						}
					}
				,'json');
			}

		} else {
			form.classList.add('was-validated');
			$('html, body').animate({
				scrollTop: $(".user-email").offset().top
			}, 500);
		}
	});
	
}

function showHideShippingAddrBlock() {
	if($("input[name='is_billing_shipping_same']").is(":checked")) {
		$(".shipping-address-block").hide();
		$(".shipping-address-block .form-control.is-required").removeAttr('required');
		$(".shipping-address-block .mandatory-err").removeClass("invalid-feedback");
		$(".terms-and-conditions").removeClass("pt-2");
	} else {
		$(".shipping-address-block").show();
		$(".shipping-address-block .form-control.is-required").prop("required", true);
		$(".shipping-address-block .mandatory-err").addClass("invalid-feedback");
		$(".terms-and-conditions").addClass("pt-2");
	}
}

function showHideCompnayDetailsBlock(formType) {
	if(formType == 'billing') {
		if($(".billing input[name='add_company_data_for_billing']:checked").val() == 'company') {
			$(".billing.company-details-container").show();
		} else {
			$(".billing.company-details-container").hide();
			$("input[name='company_name']").val('');
			$("input[name='vat_number']").val('');
		}
		
	} else if(formType == 'shipping') {
		if($(".shipping input[name='add_company_data_for_shipping']:checked").val() == 'company') {
			$(".shipping.company-details-container").show();
		} else {
			$(".shipping.company-details-container").hide();
			$("input[name='shipping_company_name']").val('');
		}
	}
}

function disableCheckbox(checkboxElemId) {
	$(checkboxElemId).prop('checked', true);
	$(checkboxElemId).prop("disabled", true);
}

function closeModalPopup(ev) {
	ev.preventDefault();
	$('#termsAndConditionsPopupModal').modal('hide');
}

$(document).ready(function() {

	if($('.gurado-storefront-cart').length || $('.gurado-storefront-payment').length || $('.gurado-storefront-checkout').length) {
		if(localStorage.getItem('guradoCart')) {
			displayCart(localStorage.getItem('guradoCart'));
		} else {
			if($('.gurado-storefront-payment').length || $('.gurado-storefront-checkout').length) {
				window.location.href = $(".list-page").attr("href");
			} else {
				$(".data-load-spinner").hide();
				$(".have-cart-items").hide();
				$(".no-cart").show();
			}
		}
	} else {
		var guradoCart = localStorage.getItem('guradoCart');
		setCartIconCount(guradoCart);
	}

	if($('.gurado-storefront-checkout').length) {
		$('.page-popup').on("click", function(e){
			e.preventDefault();
			
			$(".data-load-spinner").show();
			var parameters = {};
			parameters.agreementId = $(this).attr("data-id");
			
			$.post(
				'index.php',
				{
					eID:'get_agreement_contents',
					parameters: JSON.stringify(parameters)
				},
				function(result) {
					if(result.success) {
						$(".data-load-spinner").hide();
						$('#termsAndConditionsPopupModal').find(".modal-content .modal-header .modal-title").text(result.data.title);
						$('#termsAndConditionsPopupModal').find('.modal-content .modal-body').html(result.data.content);
						$('#termsAndConditionsPopupModal').modal('show');
					} else {
						$(".data-load-spinner").hide();
					}
				}
			,'json');
		});
	}
	
});