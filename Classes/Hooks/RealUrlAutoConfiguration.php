<?php

namespace Gurado\GuradoStorefront\Hooks;

class RealUrlAutoConfiguration {

    /**
     * Generates additional RealURL configuration and merges it with provided configuration
     *
     * @param       array $params Default configuration
     *
     * @return      array Updated configuration
     */
    public function addGuradoConfig($params) {
		return array_merge_recursive($params['config'], [
			'postVarSets' => [
				'_DEFAULT' => [
					'gurado' => [
						[
							'GETvar' => 'tx_guradostorefront_guradostoreplugin[action]',
							'valueMap' => [
								'guradoPlugin' => ''
							],
							'noMatch' => 'bypass'
						],
						[
							'GETvar' => 'tx_guradostorefront_guradostoreplugin[controller]',
							'valueMap' => [
								'GuradoStorefront' => ''
							],
							'noMatch' => 'bypass'
						],
						[
							'GETvar' => 'tx_guradostorefront_guradostoreplugin[url]',
						],
					],
				]
			]
		]);
    }
}