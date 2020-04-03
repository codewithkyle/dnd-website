<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/privacy/dlp/v2/dlp.proto

namespace Google\Cloud\Dlp\V2;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Request for the list of infoTypes.
 *
 * Generated from protobuf message <code>google.privacy.dlp.v2.ListInfoTypesRequest</code>
 */
class ListInfoTypesRequest extends \Google\Protobuf\Internal\Message
{
    /**
     * BCP-47 language code for localized infoType friendly
     * names. If omitted, or if localized strings are not available,
     * en-US strings will be returned.
     *
     * Generated from protobuf field <code>string language_code = 1;</code>
     */
    private $language_code = '';
    /**
     * filter to only return infoTypes supported by certain parts of the
     * API. Defaults to supported_by=INSPECT.
     *
     * Generated from protobuf field <code>string filter = 2;</code>
     */
    private $filter = '';
    /**
     * The geographic location to list info types. Reserved for future
     * extensions.
     *
     * Generated from protobuf field <code>string location_id = 3;</code>
     */
    private $location_id = '';

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type string $language_code
     *           BCP-47 language code for localized infoType friendly
     *           names. If omitted, or if localized strings are not available,
     *           en-US strings will be returned.
     *     @type string $filter
     *           filter to only return infoTypes supported by certain parts of the
     *           API. Defaults to supported_by=INSPECT.
     *     @type string $location_id
     *           The geographic location to list info types. Reserved for future
     *           extensions.
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Google\Privacy\Dlp\V2\Dlp::initOnce();
        parent::__construct($data);
    }

    /**
     * BCP-47 language code for localized infoType friendly
     * names. If omitted, or if localized strings are not available,
     * en-US strings will be returned.
     *
     * Generated from protobuf field <code>string language_code = 1;</code>
     * @return string
     */
    public function getLanguageCode()
    {
        return $this->language_code;
    }

    /**
     * BCP-47 language code for localized infoType friendly
     * names. If omitted, or if localized strings are not available,
     * en-US strings will be returned.
     *
     * Generated from protobuf field <code>string language_code = 1;</code>
     * @param string $var
     * @return $this
     */
    public function setLanguageCode($var)
    {
        GPBUtil::checkString($var, True);
        $this->language_code = $var;

        return $this;
    }

    /**
     * filter to only return infoTypes supported by certain parts of the
     * API. Defaults to supported_by=INSPECT.
     *
     * Generated from protobuf field <code>string filter = 2;</code>
     * @return string
     */
    public function getFilter()
    {
        return $this->filter;
    }

    /**
     * filter to only return infoTypes supported by certain parts of the
     * API. Defaults to supported_by=INSPECT.
     *
     * Generated from protobuf field <code>string filter = 2;</code>
     * @param string $var
     * @return $this
     */
    public function setFilter($var)
    {
        GPBUtil::checkString($var, True);
        $this->filter = $var;

        return $this;
    }

    /**
     * The geographic location to list info types. Reserved for future
     * extensions.
     *
     * Generated from protobuf field <code>string location_id = 3;</code>
     * @return string
     */
    public function getLocationId()
    {
        return $this->location_id;
    }

    /**
     * The geographic location to list info types. Reserved for future
     * extensions.
     *
     * Generated from protobuf field <code>string location_id = 3;</code>
     * @param string $var
     * @return $this
     */
    public function setLocationId($var)
    {
        GPBUtil::checkString($var, True);
        $this->location_id = $var;

        return $this;
    }

}

