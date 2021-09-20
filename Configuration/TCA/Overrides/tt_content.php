<?php
if (!defined('TYPO3_MODE')) { die('Access denied.'); }

call_user_func(
	function () {

		# Define extension key
		$_EXTKEY = 'gurado_storefront';
		# Prepare plugin's signature
		$extensionName = strtolower(\TYPO3\CMS\Core\Utility\GeneralUtility::underscoredToUpperCamelCase($_EXTKEY));
		
		######### GURADO PLUGIN FLEXFORM
		$productListPluginName = strtolower('Guradostoreplugin');
		$productListPluginSignature = $extensionName.'_'.$productListPluginName;

		# Add list_type to tt_content
		$GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$productListPluginSignature] = 'pi_flexform';

		# Add Flexform
		\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
			$productListPluginSignature,
			'FILE:EXT:'.$_EXTKEY . '/Configuration/FlexForms/gurado_plugin.xml'
		);
	}
);