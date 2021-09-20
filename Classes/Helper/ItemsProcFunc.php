<?php
namespace Gurado\GuradoStorefront\Helper;


/***
 *
 * This file is part of the "gurado Storefront" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 *  (c) 2021 gurado <support@gurado.de>, gurado GmbH
 *
 ***/

/**
 * itemsProcFunc
 */

class ItemsProcFunc {
	/**
     * Modifies the select box of gurado-categories-options.
     *
     * @param array &$config configuration array
     */
    function user_guradoCategories(array &$config)
    {
        /*if (is_array($GLOBALS['TYPO3_CONF_VARS']['EXTCONF']['tt_news']['what_to_display'])) {
            $config['items'] = array_merge($config['items'],
                $GLOBALS['TYPO3_CONF_VARS']['EXTCONF']['tt_news']['what_to_display']);
        }

        return $config;*/
		
		if (version_compare(TYPO3_branch, '9.0', '>=')) {
			$extensionConfiguration = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gurado_storefront'];
		} else {
			$extensionConfiguration = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['gurado_storefront']);
		}

		if($extensionConfiguration['authToken']) {
			$ch = curl_init('https://storefront.gurado.de/api/v1/collections');
			//set headers
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				'Accept: application/json', 'authorization: Bearer ' . $extensionConfiguration['authToken']
			));
			curl_setopt_array($ch, array(
				CURLOPT_RETURNTRANSFER => true
			));
			$categoriesData = json_decode(curl_exec($ch));
			curl_close($ch);

			if(count($categoriesData)) {
				array_push($config['items'], ['All', '']);
				for($i = 0; $i < count($categoriesData); $i++) {
					array_push($config['items'], [$categoriesData[$i]->name, $categoriesData[$i]->collection_id]);
				}
			} else {
				$config['items'] = [
					['No Categories to Select', '']
				];
			}
		} else {
			$config['items'] = [
				['Please provide necessary extension settings to load categories', '']
			];
		}
    }
}