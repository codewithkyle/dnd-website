<?php
/**
 * dnd module for Craft CMS 3.x
 *
 * A Dungeons and Dragons module
 *
 * @link      https://kyleandrews.dev/
 * @copyright Copyright (c) 2020 Kyle Andrews
 */

namespace modules\dndmodule\variables;

use modules\dndmodule\DndModule;

use Craft;

/**
 * dnd Variable
 *
 * Craft allows modules to provide their own template variables, accessible from
 * the {{ craft }} global variable (e.g. {{ craft.dndModule }}).
 *
 * https://craftcms.com/docs/plugins/variables
 *
 * @author    Kyle Andrews
 * @package   DndModule
 * @since     1.0.0
 */
class DndModuleVariable
{
    // Public Methods
    // =========================================================================

    /**
     * Whatever you want to output to a Twig template can go into a Variable method.
     * You can have as many variable functions as you want.  From any Twig template,
     * call it like this:
     *
     *     {{ craft.dndModule.exampleVariable }}
     *
     * Or, if your variable requires parameters from Twig:
     *
     *     {{ craft.dndModule.exampleVariable(twigValue) }}
     *
     * @param null $optional
     * @return string
     */
    public function exampleVariable($optional = null)
    {
        $result = "And away we go to the Twig template...";
        if ($optional) {
            $result = "I'm feeling optional today...";
        }
        return $result;
    }
}
