<?php

namespace Gurado\GuradoStorefront\Routing\Aspect;

use TYPO3\CMS\Core\Routing\Aspect\StaticMappableAspectInterface;
use TYPO3\CMS\Core\Site\SiteLanguageAwareTrait;

class GuradoProductSKUMapper implements StaticMappableAspectInterface{

    use SiteLanguageAwareTrait;

    /**
     * {@inheritdoc}
     */
    public function generate(string $value): ?string
    {
        return $value;
    }

    /**
     * {@inheritdoc}
     */
    public function resolve(string $value): ?string
    {
        return isset($value) ? (string)$value : null;
    }
}