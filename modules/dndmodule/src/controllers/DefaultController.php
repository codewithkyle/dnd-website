<?php
/**
 * dnd module for Craft CMS 3.x
 *
 * A Dungeons and Dragons module
 *
 * @link      https://kyleandrews.dev/
 * @copyright Copyright (c) 2020 Kyle Andrews
 */

namespace modules\dndmodule\controllers;

use modules\dndmodule\DndModule;

use Craft;
use craft\web\Controller;
use craft\elements\Entry;

/**
 * Default Controller
 *
 * Generally speaking, controllers are the middlemen between the front end of
 * the CP/website and your module’s services. They contain action methods which
 * handle individual tasks.
 *
 * A common pattern used throughout Craft involves a controller action gathering
 * post data, saving it on a model, passing the model off to a service, and then
 * responding to the request appropriately depending on the service method’s response.
 *
 * Action methods begin with the prefix “action”, followed by a description of what
 * the method does (for example, actionSaveIngredient()).
 *
 * https://craftcms.com/docs/plugins/controllers
 *
 * @author    Kyle Andrews
 * @package   DndModule
 * @since     1.0.0
 */
class DefaultController extends Controller
{

    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    protected $allowAnonymous = [];

    // Public Methods
    // =========================================================================

    /**
     * actions/dnd-module/default/remove-old-characters
     * @return mixed
     */
    public function actionRemoveOldCharacters()
    {
        $this->requireAcceptsJson();
        $this->requirePostRequest();
        $characters  = Entry::find()
                        ->section('characters')
                        ->status('disabled')
                        ->all();

        $currentUser = Craft::$app->getUser()->getIdentity();

        $response = [];
        $response['success'] = true;
        $response['errors'] = [];

        foreach ($characters as $character)
        {
            if ($character->authorId == $currentUser->id)
            {
                if (!Craft::$app->getElements()->deleteElement($character))
                {
                    $response['success'] = false;
                    $response['errors'][] = 'Failed to delete ' . $character->id;
                }
            }
        }

        return json_encode($response);
    }
}
