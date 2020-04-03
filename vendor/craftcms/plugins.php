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
  'anubarak/craft-relabel' => 
  array (
    'class' => 'anubarak\\relabel\\Relabel',
    'basePath' => $vendorDir . '/anubarak/craft-relabel/src',
    'handle' => 'relabel',
    'aliases' => 
    array (
      '@anubarak/relabel' => $vendorDir . '/anubarak/craft-relabel/src',
    ),
    'name' => 'Relabel',
    'version' => '1.3.4',
    'description' => 'Relabel Plugin Craft',
    'developer' => 'Robin Schambach',
    'developerUrl' => 'https://github.com/Anubarak',
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
  'craftcms/redactor' => 
  array (
    'class' => 'craft\\redactor\\Plugin',
    'basePath' => $vendorDir . '/craftcms/redactor/src',
    'handle' => 'redactor',
    'aliases' => 
    array (
      '@craft/redactor' => $vendorDir . '/craftcms/redactor/src',
    ),
    'name' => 'Redactor',
    'version' => '2.6.1',
    'description' => 'Edit rich text content in Craft CMS using Redactor by Imperavi.',
    'developer' => 'Pixel & Tonic',
    'developerUrl' => 'https://pixelandtonic.com/',
    'developerEmail' => 'support@craftcms.com',
    'documentationUrl' => 'https://github.com/craftcms/redactor/blob/v2/README.md',
  ),
  'ether/seo' => 
  array (
    'class' => 'ether\\seo\\Seo',
    'basePath' => $vendorDir . '/ether/seo/src',
    'handle' => 'seo',
    'aliases' => 
    array (
      '@ether/seo' => $vendorDir . '/ether/seo/src',
    ),
    'name' => 'SEO',
    'version' => '3.6.3',
    'description' => 'SEO utilities including a unique field type, sitemap, & redirect manager',
    'developer' => 'Ether Creative',
    'developerUrl' => 'https://ethercreative.co.uk',
    'documentationUrl' => 'https://github.com/ethercreative/seo/blob/v3/README.md',
  ),
  'ether/splash' => 
  array (
    'class' => 'ether\\splash\\Splash',
    'basePath' => $vendorDir . '/ether/splash/src',
    'handle' => 'splash',
    'aliases' => 
    array (
      '@ether/splash' => $vendorDir . '/ether/splash/src',
    ),
    'name' => 'Splash',
    'version' => '3.0.5',
    'schemaVersion' => '3.0.0',
    'description' => 'Quickly and easily get beautiful Unsplash images in Craft!',
    'developer' => 'Ether Creative',
    'developerUrl' => 'https://ethercreative.co.uk',
  ),
  'jalendport/craft-readtime' => 
  array (
    'class' => 'jalendport\\readtime\\ReadTime',
    'basePath' => $vendorDir . '/jalendport/craft-readtime/src',
    'handle' => 'read-time',
    'aliases' => 
    array (
      '@jalendport/readtime' => $vendorDir . '/jalendport/craft-readtime/src',
    ),
    'name' => 'Read Time',
    'version' => '1.6.0',
    'description' => 'Calculate the estimated read time for content.',
    'developer' => 'Jalen Davenport',
    'developerUrl' => 'https://jalendport.com',
    'documentationUrl' => 'https://github.com/jalendport/craft-readtime/blob/master/README.md',
    'changelogUrl' => 'https://raw.githubusercontent.com/jalendport/craft-readtime/master/CHANGELOG.md',
    'hasCpSettings' => true,
    'hasCpSection' => false,
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
  'sebastianlenz/linkfield' => 
  array (
    'class' => 'typedlinkfield\\Plugin',
    'basePath' => $vendorDir . '/sebastianlenz/linkfield/src',
    'handle' => 'typedlinkfield',
    'aliases' => 
    array (
      '@typedlinkfield' => $vendorDir . '/sebastianlenz/linkfield/src',
    ),
    'name' => 'Typed link field',
    'version' => '1.0.20',
    'description' => 'A Craft field type for selecting links',
    'developer' => 'Sebastian Lenz',
    'developerUrl' => 'https://github.com/sebastian-lenz/',
  ),
  'vaersaagod/matrixmate' => 
  array (
    'class' => 'vaersaagod\\matrixmate\\MatrixMate',
    'basePath' => $vendorDir . '/vaersaagod/matrixmate/src',
    'handle' => 'matrixmate',
    'aliases' => 
    array (
      '@vaersaagod/matrixmate' => $vendorDir . '/vaersaagod/matrixmate/src',
    ),
    'name' => 'MatrixMate',
    'version' => '1.2.5',
    'description' => 'Welding Matrix into shape, mate!',
    'developer' => 'Værsågod',
    'developerUrl' => 'https://vaersaagod.no',
    'documentationUrl' => 'https://github.com/vaersaagod/matrixmate/blob/master/README.md',
    'changelogUrl' => 'https://raw.githubusercontent.com/vaersaagod/matrixmate/master/CHANGELOG.md',
    'hasCpSettings' => false,
    'hasCpSection' => false,
  ),
  'verbb/smith' => 
  array (
    'class' => 'verbb\\smith\\Smith',
    'basePath' => $vendorDir . '/verbb/smith/src',
    'handle' => 'smith',
    'aliases' => 
    array (
      '@verbb/smith' => $vendorDir . '/verbb/smith/src',
    ),
    'name' => 'Smith',
    'version' => '1.1.1',
    'description' => 'Add copy, paste and clone functionality to Matrix blocks.',
    'developer' => 'Verbb',
    'developerUrl' => 'https://verbb.io',
    'developerEmail' => 'support@verbb.io',
    'documentationUrl' => 'https://github.com/verbb/smith',
    'changelogUrl' => 'https://raw.githubusercontent.com/verbb/smith/craft-3/CHANGELOG.md',
  ),
  'verbb/super-table' => 
  array (
    'class' => 'verbb\\supertable\\SuperTable',
    'basePath' => $vendorDir . '/verbb/super-table/src',
    'handle' => 'super-table',
    'aliases' => 
    array (
      '@verbb/supertable' => $vendorDir . '/verbb/super-table/src',
    ),
    'name' => 'Super Table',
    'version' => '2.4.6',
    'description' => 'Super-charge your Craft workflow with Super Table. Use it to group fields together or build complex Matrix-in-Matrix solutions.',
    'developer' => 'Verbb',
    'developerUrl' => 'https://verbb.io',
    'developerEmail' => 'support@verbb.io',
    'documentationUrl' => 'https://github.com/verbb/super-table',
    'changelogUrl' => 'https://raw.githubusercontent.com/verbb/super-table/craft-3/CHANGELOG.md',
  ),
);
