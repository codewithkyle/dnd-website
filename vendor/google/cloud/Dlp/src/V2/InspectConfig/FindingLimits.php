<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/privacy/dlp/v2/dlp.proto

namespace Google\Cloud\Dlp\V2\InspectConfig;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Configuration to control the number of findings returned.
 *
 * Generated from protobuf message <code>google.privacy.dlp.v2.InspectConfig.FindingLimits</code>
 */
class FindingLimits extends \Google\Protobuf\Internal\Message
{
    /**
     * Max number of findings that will be returned for each item scanned.
     * When set within `InspectDataSourceRequest`,
     * the maximum returned is 2000 regardless if this is set higher.
     * When set within `InspectContentRequest`, this field is ignored.
     *
     * Generated from protobuf field <code>int32 max_findings_per_item = 1;</code>
     */
    private $max_findings_per_item = 0;
    /**
     * Max number of findings that will be returned per request/job.
     * When set within `InspectContentRequest`, the maximum returned is 2000
     * regardless if this is set higher.
     *
     * Generated from protobuf field <code>int32 max_findings_per_request = 2;</code>
     */
    private $max_findings_per_request = 0;
    /**
     * Configuration of findings limit given for specified infoTypes.
     *
     * Generated from protobuf field <code>repeated .google.privacy.dlp.v2.InspectConfig.FindingLimits.InfoTypeLimit max_findings_per_info_type = 3;</code>
     */
    private $max_findings_per_info_type;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type int $max_findings_per_item
     *           Max number of findings that will be returned for each item scanned.
     *           When set within `InspectDataSourceRequest`,
     *           the maximum returned is 2000 regardless if this is set higher.
     *           When set within `InspectContentRequest`, this field is ignored.
     *     @type int $max_findings_per_request
     *           Max number of findings that will be returned per request/job.
     *           When set within `InspectContentRequest`, the maximum returned is 2000
     *           regardless if this is set higher.
     *     @type \Google\Cloud\Dlp\V2\InspectConfig\FindingLimits\InfoTypeLimit[]|\Google\Protobuf\Internal\RepeatedField $max_findings_per_info_type
     *           Configuration of findings limit given for specified infoTypes.
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Google\Privacy\Dlp\V2\Dlp::initOnce();
        parent::__construct($data);
    }

    /**
     * Max number of findings that will be returned for each item scanned.
     * When set within `InspectDataSourceRequest`,
     * the maximum returned is 2000 regardless if this is set higher.
     * When set within `InspectContentRequest`, this field is ignored.
     *
     * Generated from protobuf field <code>int32 max_findings_per_item = 1;</code>
     * @return int
     */
    public function getMaxFindingsPerItem()
    {
        return $this->max_findings_per_item;
    }

    /**
     * Max number of findings that will be returned for each item scanned.
     * When set within `InspectDataSourceRequest`,
     * the maximum returned is 2000 regardless if this is set higher.
     * When set within `InspectContentRequest`, this field is ignored.
     *
     * Generated from protobuf field <code>int32 max_findings_per_item = 1;</code>
     * @param int $var
     * @return $this
     */
    public function setMaxFindingsPerItem($var)
    {
        GPBUtil::checkInt32($var);
        $this->max_findings_per_item = $var;

        return $this;
    }

    /**
     * Max number of findings that will be returned per request/job.
     * When set within `InspectContentRequest`, the maximum returned is 2000
     * regardless if this is set higher.
     *
     * Generated from protobuf field <code>int32 max_findings_per_request = 2;</code>
     * @return int
     */
    public function getMaxFindingsPerRequest()
    {
        return $this->max_findings_per_request;
    }

    /**
     * Max number of findings that will be returned per request/job.
     * When set within `InspectContentRequest`, the maximum returned is 2000
     * regardless if this is set higher.
     *
     * Generated from protobuf field <code>int32 max_findings_per_request = 2;</code>
     * @param int $var
     * @return $this
     */
    public function setMaxFindingsPerRequest($var)
    {
        GPBUtil::checkInt32($var);
        $this->max_findings_per_request = $var;

        return $this;
    }

    /**
     * Configuration of findings limit given for specified infoTypes.
     *
     * Generated from protobuf field <code>repeated .google.privacy.dlp.v2.InspectConfig.FindingLimits.InfoTypeLimit max_findings_per_info_type = 3;</code>
     * @return \Google\Protobuf\Internal\RepeatedField
     */
    public function getMaxFindingsPerInfoType()
    {
        return $this->max_findings_per_info_type;
    }

    /**
     * Configuration of findings limit given for specified infoTypes.
     *
     * Generated from protobuf field <code>repeated .google.privacy.dlp.v2.InspectConfig.FindingLimits.InfoTypeLimit max_findings_per_info_type = 3;</code>
     * @param \Google\Cloud\Dlp\V2\InspectConfig\FindingLimits\InfoTypeLimit[]|\Google\Protobuf\Internal\RepeatedField $var
     * @return $this
     */
    public function setMaxFindingsPerInfoType($var)
    {
        $arr = GPBUtil::checkRepeatedField($var, \Google\Protobuf\Internal\GPBType::MESSAGE, \Google\Cloud\Dlp\V2\InspectConfig\FindingLimits\InfoTypeLimit::class);
        $this->max_findings_per_info_type = $arr;

        return $this;
    }

}

// Adding a class alias for backwards compatibility with the previous class name.
class_alias(FindingLimits::class, \Google\Cloud\Dlp\V2\InspectConfig_FindingLimits::class);

