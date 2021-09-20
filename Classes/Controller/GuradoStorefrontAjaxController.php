<?php
namespace Gurado\GuradoStorefront\Controller;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\Response;

class GuradoStorefrontAjaxController
{

	/**
	* @param ServerRequestInterface $request
	*/
	public function createCart(ServerRequestInterface $request) {
		$curl = curl_init($this->getApiUrl() . '/v1/carts');
		//set headers
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Accept: application/json', 'Content-type: application/json', 'authorization: Bearer ' . $this->getExtensionConfig('authToken')
		));
		
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		
		$curlResponseData = json_decode(curl_exec($curl));
		curl_close($curl);
		
		if($curlResponseData->cart_id) {
			$responseData = json_encode([
				'success' => true,
				'data' => [
					'cart'=> $curlResponseData->cart_id
			   ]
			], JSON_UNESCAPED_UNICODE);
		} else {
			$responseData = json_encode([
				'success' => false,
				'error' => $curlResponseData->message
			], JSON_UNESCAPED_UNICODE);
		}
		
		$response = new Response();
        $response->getBody()->write($responseData);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
	
	/**
	* @param ServerRequestInterface $request
	*/
	public function addProductToCart(ServerRequestInterface $request) {
		$parameters = array();
		$parameters = json_decode($request->getParsedBody()['postData']);
		$guradoCart = $parameters->guradoCart;
		unset($parameters->guradoCart);
		
		$curl = curl_init($this->getApiUrl() . '/v1/carts/'.$guradoCart.'/items');
		//set headers
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Accept: application/json', 'Content-type: application/json', 'authorization: Bearer ' . $this->getExtensionConfig('authToken')
		));
		
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($parameters));
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		
		$curlResponseData = json_decode(curl_exec($curl));
		curl_close($curl);

		if($curlResponseData->message) {
			$responseData = json_encode([
				'success' => false,
				'error' => $curlResponseData->message,
				'error_code' => $curlResponseData->code
			], JSON_UNESCAPED_UNICODE);
		} else {
			$responseData = json_encode([
				'success' => true
			], JSON_UNESCAPED_UNICODE);
		}
		
		$response = new Response();
        $response->getBody()->write($responseData);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
	
	/**
	* @param ServerRequestInterface $request
	*/
	public function cartItems(ServerRequestInterface $request) {
		$parameters = array();
		$parameters = json_decode($request->getParsedBody()['parameters']);
		$guradoCart = $parameters->guradoCart;
		
		$curl = curl_init($this->getApiUrl() . '/v1/carts/' . $guradoCart);
		//set headers
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Accept: application/json', 'authorization: Bearer ' . $this->getExtensionConfig('authToken')
		));
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$cartData = json_decode(curl_exec($curl));
		curl_close($curl);
		
		if (is_object($cartData) && (count(get_object_vars($cartData)) === 0)) {
			$responseData = json_encode([
				'success' => true,
				'data' => ['items' => []]
			], JSON_UNESCAPED_UNICODE);
		} else {
			if($cartData->items) {
				$responseData = json_encode([
					'success' => true,
					'data' => $cartData
				], JSON_UNESCAPED_UNICODE);
			} else {
				$responseData = json_encode([
					'success' => false,
					'error' => $cartData->message,
					'error_code' => $cartData->code
				], JSON_UNESCAPED_UNICODE);
			}
		}
		
		$response = new Response();
        $response->getBody()->write($responseData);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
	
	/**
	* @param ServerRequestInterface $request
	*/
	public function deleteCartItem(ServerRequestInterface $request) {
		$parameters = array();
		$parameters = json_decode($request->getParsedBody()['parameters']);
		
		$curl = curl_init($this->getApiUrl() . '/v1/carts/' . $parameters->guradoCart . '/items/' . $parameters->itemId);
		//set headers
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Accept: application/json', 'Content-type: application/json', 'authorization: Bearer ' . $this->getExtensionConfig('authToken')
		));
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$cartData = json_decode(curl_exec($curl));
		curl_close($curl);
		
		$responseData = json_encode([
			'success' => true
		], JSON_UNESCAPED_UNICODE);
		
		$response = new Response();
        $response->getBody()->write($responseData);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
	
	/**
	* @param ServerRequestInterface $request
	*/
	public function updateCartItemQty(ServerRequestInterface $request) {
		$parameters = array();
		$parameters = json_decode($request->getParsedBody()['parameters']);
		
		$curl = curl_init($this->getApiUrl() . '/v1/carts/' . $parameters->guradoCart . '/items/' . $parameters->itemId);
		
		$temp = array();
		$temp['op'] = "replace";
		$temp['path'] = "/qty";
		$temp['value'] = $parameters->qty;
		$curlPostData[] = (object) $temp;
		
		//set headers
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Accept: application/json', 'Content-type: application/json', 'authorization: Bearer ' . $this->getExtensionConfig('authToken')
		));
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");
		curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($curlPostData));
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$cartData = json_decode(curl_exec($curl));
		curl_close($curl);
		
		$responseData = json_encode([
			'success' => true
		], JSON_UNESCAPED_UNICODE);
		
		$response = new Response();
        $response->getBody()->write($responseData);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }


	/**
	* @param ServerRequestInterface $request
	*/
	public function calculateConfigPorductPrice(ServerRequestInterface $request) {
		$parameters = array();
		$parameters = json_decode($request->getParsedBody()['postData']);
		$productId = $parameters->productId;
		unset($parameters->productId);
		
		$curl = curl_init($this->getApiUrl() . '/v1/products/' . $productId . '/price-estimations');
		//set headers
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Accept: application/json', 'Content-type: application/json', 'authorization: Bearer ' . $this->getExtensionConfig('authToken')
		));
		
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($parameters));
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		
		$curlResponseData = json_decode(curl_exec($curl));
		curl_close($curl);
		
		if($curlResponseData->message) {
			$responseData = json_encode([
				'success' => false,
				'error' => $curlResponseData->message
			], JSON_UNESCAPED_UNICODE);
		} else {
			$responseData = json_encode([
				'success' => true,
				'price' => $curlResponseData->price
			], JSON_UNESCAPED_UNICODE);
		}
		
		$response = new Response();
        $response->getBody()->write($responseData);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
	
	/**
	* @param ServerRequestInterface $request
	*/
	public function addAddress(ServerRequestInterface $request) {
		$parameters = array();
		$parameters = json_decode($request->getParsedBody()['parameters']);

		//add email
		$temp1 = array();
		$temp1['op'] = "add";
		$temp1['path'] = "/guest";
		$temp1['value'] = (object) array('email_address' => $parameters->email_address);
		$curlPostData[] = (object) $temp1;
		
		//add billing address
		$temp2 = array();
		$temp2['op'] = "add";
		$temp2['path'] = "/billing-address";
		
		$billingAddress = array();
		$billingAddress['firstname'] = $parameters->firstname;
		$billingAddress['lastname'] = $parameters->lastname;
		$billingAddress['street'] = $parameters->street;
		$billingAddress['house_number'] = $parameters->house_number;
		$billingAddress['postcode'] = $parameters->postcode;
		$billingAddress['city'] = $parameters->city;
		$billingAddress['country_code'] = $parameters->country_code;
		
		if($parameters->company_name)
			$billingAddress['company_name'] = $parameters->company_name;
		if($parameters->vat_number)
			$billingAddress['vat_number'] = $parameters->vat_number;
		if($parameters->phone_number)
			$billingAddress['phone_number'] = $parameters->phone_number;
		
		if($parameters->requires_shipping == "1") {
			if($parameters->isShippingAndBillingSame == 0) {
				$billingAddress['use_for_shipping'] = 0;
			} else {
				$billingAddress['use_for_shipping'] = 1;
			}
		}
		
		$temp2['value'] = (object) $billingAddress;
		$curlPostData[] = (object) $temp2;
		
		//add shipping address if present
		if($parameters->requires_shipping == "1" && $parameters->isShippingAndBillingSame == 0) {
			$temp3 = array();
			$temp3['op'] = "add";
			$temp3['path'] = "/shipping-address";
			
			$shippingAddress = array();
			$shippingAddress['firstname'] = $parameters->shipping_firstname;
			$shippingAddress['lastname'] = $parameters->shipping_lastname;
			$shippingAddress['street'] = $parameters->shipping_street;
			$shippingAddress['house_number'] = $parameters->shipping_house_number;
			$shippingAddress['postcode'] = $parameters->shipping_postcode;
			$shippingAddress['city'] = $parameters->shipping_city;
			$shippingAddress['country_code'] = $parameters->shipping_country_code;
			
			if($parameters->shipping_company_name)
				$shippingAddress['company_name'] = $parameters->shipping_company_name;
			if($parameters->shipping_phone_number)
				$shippingAddress['phone_number'] = $parameters->shipping_phone_number;
			
			$temp3['value'] = (object) $shippingAddress;
			$curlPostData[] = (object) $temp3;
		}
		
		$curl = curl_init($this->getApiUrl() . '/v1/carts/' . $parameters->guradoCart);
		//set headers
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Accept: application/json', 'Content-type: application/json', 'authorization: Bearer ' . $this->getExtensionConfig('authToken')
		));
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");
		curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($curlPostData));
		curl_setopt($curl, CURLOPT_HEADER, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$cartData = json_decode(curl_exec($curl));
		$curlResponseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);
		
		if($curlResponseCode == 204) {
			$responseData = json_encode([
				'success' => true
			], JSON_UNESCAPED_UNICODE);
		} else {
			$responseData = json_encode([
				'success' => false,
				'responseCode' => $curlResponseCode
			], JSON_UNESCAPED_UNICODE);
		}
		
		$response = new Response();
        $response->getBody()->write($responseData);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
	
	/**
	* @param ServerRequestInterface $request
	*/
	public function getAgreementContents(ServerRequestInterface $request) {
		$parameters = array();
		$parameters = json_decode($request->getParsedBody()['parameters']);
		
		$curl = curl_init($this->getApiUrl() . '/v1/agreements/' . $parameters->agreementId);
		//set headers
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Accept: application/json', 'authorization: Bearer ' . $this->getExtensionConfig('authToken')
		));
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$agreementData = json_decode(curl_exec($curl));
		curl_close($curl);
		
		$responseData = json_encode([
			'success' => true,
			'data' => $agreementData
		], JSON_UNESCAPED_UNICODE);
		
		$response = new Response();
        $response->getBody()->write($responseData);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
	
	/**
	* @param ServerRequestInterface $request
	*/
	public function setAgreement(ServerRequestInterface $request) {
		$parameters = array();
		$parameters = json_decode($request->getParsedBody()['parameters']);
		$guradoCart = $parameters->guradoCart;
		unset($parameters->guradoCart);
		
		$curl = curl_init($this->getApiUrl() . '/v1/carts/' . $guradoCart);
		
		$temp = array();
		$temp['op'] = "add";
		$temp['path'] = "/agreements";
		
		$i = 0;
		foreach($parameters as $key => $value){
			$tempArray = [];
			$tempArray['agreement_id'] = $value;
			
			$temp['value'][$i] = (object) $tempArray;
			$i++;
		}
		
		$curlPostData[] = (object) $temp;
		
		//set headers
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Accept: application/json', 'Content-type: application/json', 'authorization: Bearer ' . $this->getExtensionConfig('authToken')
		));
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");
		curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($curlPostData));
		curl_setopt($curl, CURLOPT_HEADER, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$cartData = json_decode(curl_exec($curl));
		$curlResponseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);
		
		if($curlResponseCode == 204) {
			$responseData = json_encode([
				'success' => true
			], JSON_UNESCAPED_UNICODE);
		} else {
			$responseData = json_encode([
				'success' => false,
				'responseCode' => $curlResponseCode
			], JSON_UNESCAPED_UNICODE);
		}
		
		$response = new Response();
        $response->getBody()->write($responseData);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
	
	protected function getExtensionConfig($varname) {
		if (version_compare(TYPO3_branch, '9.0', '>=')) {
			$extensionConfiguration = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gurado_storefront'];
		} else {
			$extensionConfiguration = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['gurado_storefront']);
		}
		//$extensionConfiguration = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gurado_storefront'];
		return $extensionConfiguration[$varname];
	}
	
	protected function getApiUrl() {
		return 'https://storefront.gurado.de/api';
	}
}
