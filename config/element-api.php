<?php

use craft\elements\Entry;
use craft\helpers\UrlHelper;

return [
    'endpoints' => [
        '/api/<campaignId:\d+>/monsters.json' => function($campaignId) {
            return [
                'elementType' => Entry::class,
                'criteria' => [
                    'section' => 'monsters',
                    'relatedTo' => $campaignId,
                ],
                'transformer' => function(Entry $entry) {
                    return [
                        'uid' => $entry->uid,
                        'name' => $entry->title,
	                    'flavorText' => $entry->flavorText,
	                    'alignment' => $entry->alignment,
	                    'ac' => $entry->armorClass,
	                    'maxHitPoints' => $entry->maximumHitPoints,
	                    'speed' => $entry->speed,
	                    'exp' => $entry->exp,
	                    'notes' => $entry->notes,
	                    'actions' => $entry->actions,
	                    'legendaryActions' => $entry->legendaryActions,
	                    'charisma' => $entry->charisma,
	                    'charismaModifier' => $entry->charismaModifier,
	                    'constitution' => $entry->constitution,
	                    'constitutionModifier' => $entry->constitutionModifier,
	                    'dexterity' => $entry->dexterity,
	                    'dexterityModifier' => $entry->dexterityModifier,
	                    'intelligence' => $entry->intelligence,
	                    'intelligenceModifier' => $entry->intelligenceModifier,
	                    'strength' => $entry->strength,
	                    'strengthModifier' => $entry->strengthModifier,
	                    'wisdom' => $entry->wisdom,
	                    'wisdomModifier' => $entry->wisdomModifier,
                    ];
                },
            ];
        },
    ]
];