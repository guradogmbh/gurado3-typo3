<?php
defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function()
    {
		\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gurado.GuradoStorefront',
            'Guradostoreplugin',
            [
                'GuradoStorefront' => 'guradoPlugin'
            ],
            // non-cacheable actions
            [
                'GuradoStorefront' => 'guradoPlugin'
            ]
        );
		
        // wizards
		\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
            'mod {
                wizards.newContentElement.wizardItems.plugins {
                    elements {
                        guradostoreplugin {
                            iconIdentifier = gurado_storefront-plugin-icon
                            title = LLL:EXT:gurado_storefront/Resources/Private/Language/locallang_db.xlf:tx_gurado_storefront
                            description = LLL:EXT:gurado_storefront/Resources/Private/Language/locallang_db.xlf:tx_gurado_storefront
                            tt_content_defValues {
                                CType = list
                                list_type = guradostorefront_guradostoreplugin
                            }
                        }
                    }
                    show = *
                }
           }'
        );
		
		$iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);
		
		$iconRegistry->registerIcon(
			'gurado_storefront-plugin-icon',
			\TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
			['source' => 'EXT:gurado_storefront/Resources/Public/Icons/Extension.svg']
		);
		

		$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['create_cart'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::createCart';
		
		$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['add_product_to_cart'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::addProductToCart';
		
		$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['cart'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::cartItems';
		
		$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['delete_cart_item'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::deleteCartItem';
		
		$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['update_cart_item_qty'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::updateCartItemQty';
		
		$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['calculate_config_product_price'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::calculateConfigPorductPrice';
		

        $GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['create_cart_redemption'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::createCartRedemption';

        $GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['delete_cart_redemption'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::deleteCartRedemption';

		$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['checkout'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::addAddress';
		
		$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['get_agreement_contents'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::getAgreementContents';
		
		$GLOBALS['TYPO3_CONF_VARS']['FE']['eID_include']['set_agreements'] = \Gurado\GuradoStorefront\Controller\GuradoStorefrontAjaxController::class . '::setAgreement';
		
		
		// add custom Aspect for detail to get rid of the cHash in detail link
		$GLOBALS['TYPO3_CONF_VARS']['SYS']['routing']['aspects']['GuradoProductSKUMapper'] = \Gurado\GuradoStorefront\Routing\Aspect\GuradoProductSKUMapper::class;
		
		
		// realurl hook for details link url rewrite
		if (\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::isLoaded('realurl')) {
		  $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['ext/realurl/class.tx_realurl_autoconfgen.php']['extensionConfiguration']['gurado_storefront'] = \Gurado\GuradoStorefront\Hooks\RealUrlAutoConfiguration::class . '->addGuradoConfig';
		}
		
		// Extension Settings register in setup:
		if (version_compare(TYPO3_branch, '9.0', '>=')) {
			$guradoStorefrontExtConf = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gurado_storefront'];
		} else {
			$guradoStorefrontExtConf = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['gurado_storefront']);
		}
		
		if($guradoStorefrontExtConf['includeJquery']) {
			\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTypoScriptSetup(
				'page.includeJSFooter.10 = EXT:gurado_storefront/Resources/Public/Js/jquery-3.5.1.min.js'
			);
		}
		
		if($guradoStorefrontExtConf['includeBootstrap']) {
			\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTypoScriptSetup(
				'page.includeCSS.5 = EXT:gurado_storefront/Resources/Public/Css/bootstrap.min.css'
			);
			
			\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTypoScriptSetup(
				'page.includeJSFooter.20 = EXT:gurado_storefront/Resources/Public/Js/bootstrap.bundle.min.js'
			);
		}
		
		$cssSetupString = 'body.modal{display:inherit;}';
		if($guradoStorefrontExtConf['textColor']) {
			$cssSetupString .= 'body,.form-check-input.is-valid ~ .form-check-label,.was-validated .form-check-input:valid ~ .form-check-label,.cart-details .update-cart-item .delete-cart-item,.cart-details .update-cart-item .update-cart-btn,.form-control,.form-control::placeholder,.form-text{color:' . $guradoStorefrontExtConf['textColor'] . ';}.card .card-title,.mobile-cart-row .update-cart-btn,#cartTable .cell h5{color:' . $guradoStorefrontExtConf['textColor'] . '!important;}.div-toggle-tabs .btn{background-color: ' . $guradoStorefrontExtConf['textColor'] . '!important;border-color: ' . $guradoStorefrontExtConf['textColor'] . '!important;}';
		}
		
		if($guradoStorefrontExtConf['headingColor']) {
			$cssSetupString .= 'h1,h2,h3,h4,h5,h6,.block-heading{color:' . $guradoStorefrontExtConf['headingColor'] . ';}';
		}
		
		if($guradoStorefrontExtConf['linkColor']) {
			$cssSetupString .= 'a,.gurado-storefront a:hover,.gurado-storefront a:focus,.gurado-storefront a:visited,.card span.price,.terms-and-conditions .page-popup,.terms-and-conditions .page-popup label{color:' . $guradoStorefrontExtConf['linkColor'] . ';}.cart-icon .cart-total{background-color:' . $guradoStorefrontExtConf['linkColor'] . ';color: #ffffff;}.back-to-last-page{color:' . $guradoStorefrontExtConf['linkColor'] . '!important;}.form-check.no-checkbox::before{background-color:' . $guradoStorefrontExtConf['linkColor'] . ';}';
		}
		
		if($guradoStorefrontExtConf['buttonColor']) {
			$cssSetupString .= '.btn,.div-toggle-tabs .btn.active{background-color:' . $guradoStorefrontExtConf['buttonColor'] . '!important;border-color: ' . $guradoStorefrontExtConf['buttonColor'] . '!important;}.btn.btn-invert{color:' . $guradoStorefrontExtConf['buttonColor'] . '!important;}.form-check-input.is-valid:checked, .was-validated .form-check-input:valid:checked, .form-check-input:checked,.progress-steps span.steps.active,.carousel-control-next,.carousel-control-prev{background-color:' . $guradoStorefrontExtConf['buttonColor'] . ';}.form-check-input.is-valid, .was-validated .form-check-input:valid, .form-check-input:checked{border-color:' . $guradoStorefrontExtConf['buttonColor'] . ';}.voucher-select span.img.selected{border: 3px solid ' . $guradoStorefrontExtConf['buttonColor'] . ';}@media all and (max-width: 450px){.back-to-last-page{background-color:' . $guradoStorefrontExtConf['buttonColor'] . ';}}';
		}
		
		if($guradoStorefrontExtConf['buttonTextColor']) {
			$cssSetupString .= '.btn,.carousel-control-next,.carousel-control-prev{color:' . $guradoStorefrontExtConf['buttonTextColor'] . '!important;}.btn.btn-invert{background-color:' . $guradoStorefrontExtConf['buttonTextColor'] . '!important;}.progress-steps span.steps{color: ' . $guradoStorefrontExtConf['buttonTextColor'] . ';}@media all and (max-width: 450px){.back-to-last-page{color:' . $guradoStorefrontExtConf['buttonTextColor'] . '!important;}}';
		}
		
		if($guradoStorefrontExtConf['borderColor']) {
			$cssSetupString .= '.form-control,#cartTable .cell{border-bottom: 1px solid ' . $guradoStorefrontExtConf['borderColor'] . ';}select,.form-select,.qty-container{border:1px solid ' . $guradoStorefrontExtConf['borderColor'] . ';}.form-control:focus,.form-select:focus,.form-control.is-invalid:focus,.was-validated .form-control:invalid:focus,.form-control.is-valid:focus,.was-validated .form-control:valid:focus,.form-select.is-valid:focus,.was-validated .form-select:valid:focus,.form-control.is-valid,.was-validated .form-control:valid,.form-select.is-valid,.was-validated .form-select:valid,.form-check-input.is-valid:focus,.was-validated .form-check-input:valid:focus,.form-check-input:focus{border-color:' . $guradoStorefrontExtConf['borderColor'] . ';}.cart-icon{box-shadow:0px 0px 5px ' . $guradoStorefrontExtConf['borderColor'] . ';-webkit-box-shadow:0px 0px 5px ' . $guradoStorefrontExtConf['borderColor'] . ';-moz-box-shadow:0px 0px 5px ' . $guradoStorefrontExtConf['borderColor'] . ';}.summary-label{border-bottom:1px dotted ' . $guradoStorefrontExtConf['borderColor'] . ';}.progress-steps span.progress-line{background-color:' . $guradoStorefrontExtConf['borderColor'] . ';}.progress-steps span.steps .label,.form-row .collapse-btn{color:' . $guradoStorefrontExtConf['borderColor'] . ';}.progress-steps span.steps{background-color: ' . $guradoStorefrontExtConf['borderColor'] . ';}.qty-container span.qty-value{border-left:1px solid ' . $guradoStorefrontExtConf['borderColor'] . ';border-right:1px solid ' . $guradoStorefrontExtConf['borderColor'] . ';}';
		}
		
		if($cssSetupString) {
			\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTypoScriptSetup(
				trim('
					page.headerData.107 = TEXT
					page.headerData.107.wrap = <style id="extension-config-settings">|</style>
					page.headerData.107.value (
						' . $cssSetupString . '
					)
				')
			);
		}
		
    }
	
);
