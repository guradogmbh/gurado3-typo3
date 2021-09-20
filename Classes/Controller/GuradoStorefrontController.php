<?php
namespace Gurado\GuradoStorefront\Controller;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use Gurado\GuradoStorefront\PageTitle\GuradoPageTitleProvider;


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
 * GuradoStorefrontController
 */
class GuradoStorefrontController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController
{

    /**
     * guradoStorefrontRepository
     * 
     * @var \Gurado\GuradoStorefront\Domain\Repository\GuradoStorefrontRepository
     */
    protected $guradoStorefrontRepository = null;

    /**
     * @param \Gurado\GuradoStorefront\Domain\Repository\GuradoStorefrontRepository $guradoStorefrontRepository
     */
    public function injectGuradoStorefrontRepository(\Gurado\GuradoStorefront\Domain\Repository\GuradoStorefrontRepository $guradoStorefrontRepository)
    {
        $this->guradoStorefrontRepository = $guradoStorefrontRepository;
    }
	
	/**
     * action guradoPlugin
     * 
     * @return void
     */
    public function guradoPluginAction()
    {
		if (version_compare(TYPO3_branch, '9.0', '>=')) {
			$extensionConfiguration = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gurado_storefront'];
		} else {
			$extensionConfiguration = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['gurado_storefront']);
		}
		//$extensionConfiguration = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gurado_storefront'];
		
		if(!$extensionConfiguration['authToken'] || !$extensionConfiguration['clientId']) {
			$this->view->assign('showSettingsError', 1);
		} else {
			
			$this->view->assign('showSettingsError', 0);
			$this->view->assign('includeBootstrap', $extensionConfiguration['includeBootstrap']);
			$this->view->assign('clientId', $extensionConfiguration['clientId']);
			
			if($this->settings['view'] == 'list') {
				## List view
				$page = '';
				if($_GET['page']) {
					$page = '?page=' . $_GET['page'];
				}

				$category = '';
				if($this->settings['guradoCategories']) {
					if($page) {
						$category = '&collection_id=' . $this->settings['guradoCategories'];
					} else {
						$category = '?collection_id=' . $this->settings['guradoCategories'];
					}
				}
				
				$ch = curl_init($this->getApiUrl() . '/v1/products' . $page . $category);
				//set headers
				curl_setopt($ch, CURLOPT_HTTPHEADER, array(
					'Accept: application/json', 'authorization: Bearer ' . $extensionConfiguration['authToken']
				));
				curl_setopt_array($ch, array(
					CURLOPT_RETURNTRANSFER => true
				));
				
				$storeProductsData = json_decode(curl_exec($ch));
				curl_close($ch);
				
				if($storeProductsData->pagination->last_page > 1) {
					$this->view->assign('showPagination', 1);
					$this->view->assign('paginationData', $storeProductsData->pagination);
					
					$pages = [];
					for($i = 0; $i < $storeProductsData->pagination->last_page; $i++) {
						$pages[$i] = $i + 1;
					}
					$this->view->assign('pages', $pages);
					
				} else {
					$this->view->assign('showPagination', 0);
					$this->view->assign('paginationData', []);
					$this->view->assign('pages', []);
				}
				
				$storeProductsDataWihtoutPagination = $storeProductsData->data;
				
				if(count($storeProductsDataWihtoutPagination) == 1) {
					$arguments = array();
					$arguments['url'] = $storeProductsDataWihtoutPagination[0]->url_key;
					$this->redirect("guradoPlugin", NULL, NULL, $arguments, $this->settings['detailsPid']);
				}
				
				$this->view->assign('storeProductsArray', $storeProductsDataWihtoutPagination);
			} else if($this->settings['view'] == 'detail') {
				## Details view
				
				$url_key = $this->request->getArgument('url');
				//get product sku
				$curl = curl_init($this->getApiUrl() . '/v1/products?url_key=' . $url_key);
				//set headers
				curl_setopt($curl, CURLOPT_HTTPHEADER, array(
					'Accept: application/json', 'authorization: Bearer ' . $extensionConfiguration['authToken']
				));
				curl_setopt_array($curl, array(
					CURLOPT_RETURNTRANSFER => true
				));
				$productSkuData = json_decode(curl_exec($curl));
				curl_close($curl);
				
				$productSku = $productSkuData->data[0]->sku;
				
				//get product details
				$ch = curl_init($this->getApiUrl() . '/v1/products/' . $productSku);
				//set headers
				curl_setopt($ch, CURLOPT_HTTPHEADER, array(
					'Accept: application/json', 'authorization: Bearer ' . $extensionConfiguration['authToken']
				));
				curl_setopt_array($ch, array(
					CURLOPT_RETURNTRANSFER => true
				));
				$productData = json_decode(curl_exec($ch));
				curl_close($ch);
				
				//set page title to article name
				if (version_compare(TYPO3_branch, '9.0', '>=')) {
					$titleProvider = GeneralUtility::makeInstance(GuradoPageTitleProvider::class);
					$titleProvider->setTitle($productData->name);
				} else {
					$GLOBALS['TSFE']->page['title'] = $productData->name;
				}
				
				if($productData->currency_code == 'EUR') {
					$productData->currency_sign = '€';
				} else {
					$productData->currency_sign = '$';
				}
				
				if($productData->virtual_voucher_design_templates && count($productData->virtual_voucher_design_templates))
					$productData->virtual_voucher_templates = array_chunk($productData->virtual_voucher_design_templates, 3);
				else 
					$productData->virtual_voucher_templates = [];
				
				if($productData->physical_voucher_design_templates && count($productData->physical_voucher_design_templates))
					$productData->physical_voucher_templates = array_chunk($productData->physical_voucher_design_templates, 3);
				else 
					$productData->physical_voucher_templates = [];
				
				$this->view->assign('productDetails', $productData);

				if($productData->options && count($productData->options)) {
					$this->view->assign('showOptions', 1);
				} else {
					$this->view->assign('showOptions', 0);
				}
			} else if($this->settings['view'] == 'checkout') {
				## Checkout view
				$ch = curl_init($this->getApiUrl() . '/v1/countries');
				//set headers 
				curl_setopt($ch, CURLOPT_HTTPHEADER, array(
					'Accept: application/json', 'authorization: Bearer ' . $extensionConfiguration['authToken']
				));
				curl_setopt_array($ch, array(
					CURLOPT_RETURNTRANSFER => true
				));
				$countries = json_decode(curl_exec($ch));
				curl_close($ch);
				
				$ch1 = curl_init($this->getApiUrl() . '/v1/agreements');
				//set headers 
				curl_setopt($ch1, CURLOPT_HTTPHEADER, array(
					'Accept: application/json', 'authorization: Bearer ' . $extensionConfiguration['authToken']
				));
				curl_setopt_array($ch1, array(
					CURLOPT_RETURNTRANSFER => true
				));
				$agreements = json_decode(curl_exec($ch1));
				curl_close($ch1);
				
				$this->view->assign('countries', $countries);
				$this->view->assign('agreements', $agreements);
				
			} else if($this->settings['view'] == 'payment') {
				## Payment view
				$ch = curl_init($this->getApiUrl() . '/v1/countries');
				//set headers 
				curl_setopt($ch, CURLOPT_HTTPHEADER, array(
					'Accept: application/json', 'authorization: Bearer ' . $extensionConfiguration['authToken']
				));
				curl_setopt_array($ch, array(
					CURLOPT_RETURNTRANSFER => true
				));
				$countries = json_decode(curl_exec($ch));
				curl_close($ch);
				
				$this->view->assign('countries', $countries);
				
			}
		}
		
    }

	public function getApiUrl(){
		return 'https://storefront.gurado.de/api';
	}
}
