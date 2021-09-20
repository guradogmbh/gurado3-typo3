<?php
defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function()
    {
		
		\TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gurado.GuradoStorefront',
            'Guradostoreplugin',
			'LLL:EXT:gurado_storefront/Resources/Private/Language/locallang_db.xlf:tx_gurado_storefront'
        );

        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile('gurado_storefront', 'Configuration/TypoScript', 'gurado Storefront');

    }
);
