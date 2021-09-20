<?php
namespace Gurado\GuradoStorefront\PageTitle;

use TYPO3\CMS\Core\PageTitle\AbstractPageTitleProvider;

class GuradoPageTitleProvider extends AbstractPageTitleProvider
{
    /**
     * @param string $title
     */
    public function setTitle(string $title)
    {
        $this->title = $title;
    }
}