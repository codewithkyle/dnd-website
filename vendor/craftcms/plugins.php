<?php

$vendorDir = dirname(__DIR__);
$rootDir = dirname(dirname(__DIR__));

return array (
  'aelvan/imager' => 
  array (
    'class' => 'aelvan\\imager\\Imager',
    'basePath' => $vendorDir . '/aelvan/imager/src',
    'handle' => 'imager',
    'aliases' => 
    array (
      '@aelvan/imager' => $vendorDir . '/aelvan/imager/src',
    ),
    'name' => 'Imager',
    'version' => 'v2.4.0',
    'schemaVersion' => '2.0.0',
    'description' => 'Image transforms gone wild',
    'developer' => 'André Elvan',
    'developerUrl' => 'https://www.vaersaagod.no',
    'documentationUrl' => 'https://github.com/aelvan/Imager-Craft/blob/craft3/README.md',
    'changelogUrl' => 'https://raw.githubusercontent.com/aelvan/Imager-Craft/craft3/CHANGELOG.md',
    'hasCpSettings' => false,
    'hasCpSection' => false,
    'components' => 
    array (
    ),
  ),
  'craftcms/element-api' => 
  array (
    'class' => 'craft\\elementapi\\Plugin',
    'basePath' => $vendorDir . '/craftcms/element-api/src',
    'handle' => 'element-api',
    'aliases' => 
    array (
      '@craft/elementapi' => $vendorDir . '/craftcms/element-api/src',
    ),
    'name' => 'Element API',
    'version' => '2.6.0',
    'description' => 'Create a JSON API for your elements in Craft',
    'developer' => 'Pixel & Tonic',
    'developerUrl' => 'https://pixelandtonic.com/',
    'developerEmail' => 'support@craftcms.com',
    'documentationUrl' => 'https://github.com/craftcms/element-api/blob/v2/README.md',
  ),
  'nystudio107/craft-eagerbeaver' => 
  array (
    'class' => 'nystudio107\\eagerbeaver\\EagerBeaver',
    'basePath' => $vendorDir . '/nystudio107/craft-eagerbeaver/src',
    'handle' => 'eager-beaver',
    'aliases' => 
    array (
      '@nystudio107/eagerbeaver' => $vendorDir . '/nystudio107/craft-eagerbeaver/src',
    ),
    'name' => 'Eager Beaver',
    'version' => '1.0.4',
    'schemaVersion' => '1.0.0',
    'description' => 'Allows you to eager load elements from auto-injected Entry elements on demand from your templates.',
    'developer' => 'nystudio107',
    'developerUrl' => 'https://nystudio107.com',
    'documentationUrl' => 'https://github.com/nystudio107/craft-eagerbeaver/blob/v1/README.md',
    'changelogUrl' => 'https://raw.githubusercontent.com/nystudio107/craft-eagerbeaver/v1/CHANGELOG.md',
    'hasCpSettings' => false,
    'hasCpSection' => false,
    'components' => 
    array (
      'eagerBeaverService' => 'nystudio107\\eagerbeaver\\services\\EagerBeaverService',
    ),
  ),
);
