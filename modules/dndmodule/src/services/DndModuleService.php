<?php
/**
 * dnd module for Craft CMS 3.x
 *
 * A Dungeons and Dragons module
 *
 * @link      https://kyleandrews.dev/
 * @copyright Copyright (c) 2020 Kyle Andrews
 */

namespace modules\dndmodule\services;

use modules\dndmodule\DndModule;

use Craft;
use craft\base\Component;

/**
 * DndModuleService Service
 *
 * All of your module’s business logic should go in services, including saving data,
 * retrieving data, etc. They provide APIs that your controllers, template variables,
 * and other modules can interact with.
 *
 * https://craftcms.com/docs/plugins/services
 *
 * @author    Kyle Andrews
 * @package   DndModule
 * @since     1.0.0
 */
class DndModuleService extends Component
{
    // Public Methods
    // =========================================================================

    /**
     * This function can literally be anything you want, and you can have as many service
     * functions as you want
     *
     * From any other plugin/module file, call it like this:
     *
     *     DndModule::$instance->dndModuleService->exampleService()
     *
     * @return mixed
     */
    public function exampleService()
    {
        $result = 'something';

        return $result;
    }
}
