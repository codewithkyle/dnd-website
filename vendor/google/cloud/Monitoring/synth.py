# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""This script is used to synthesize generated parts of this library."""

import os
import synthtool as s
import synthtool.gcp as gcp
import logging

logging.basicConfig(level=logging.DEBUG)

gapic = gcp.GAPICGenerator()
common = gcp.CommonTemplates()

library = gapic.php_library(
    service='monitoring',
    version='v3',
    config_path='/google/monitoring/artman_monitoring.yaml',
    artman_output_name='google-cloud-monitoring-v3')

# copy all src including partial veneer classes
s.move(library / 'src')

# copy proto files to src also
s.move(library / 'proto/src/Google/Cloud/Monitoring', 'src/')
s.move(library / 'tests/')

# copy GPBMetadata file to metadata
s.move(library / 'proto/src/GPBMetadata/Google/Monitoring', 'metadata/')

# document and utilize apiEndpoint instead of serviceAddress
s.replace(
    "**/Gapic/*GapicClient.php",
    r"'serviceAddress' =>",
    r"'apiEndpoint' =>")
s.replace(
    "**/Gapic/*GapicClient.php",
    r"@type string \$serviceAddress\n\s+\*\s+The address",
    r"""@type string $serviceAddress
     *           **Deprecated**. This option will be removed in a future major release. Please
     *           utilize the `$apiEndpoint` option instead.
     *     @type string $apiEndpoint
     *           The address""")
s.replace(
    "**/Gapic/*GapicClient.php",
    r"\$transportConfig, and any \$serviceAddress",
    r"$transportConfig, and any `$apiEndpoint`")

# fix year
for client in ['GroupService', 'MetricService', 'UptimeCheckService']:
    s.replace(
        f'**/Gapic/{client}GapicClient.php',
        r'Copyright \d{4}',
        'Copyright 2017')
    s.replace(
        f'**/V3/{client}Client.php',
        r'Copyright \d{4}',
        'Copyright 2017')

for client in ['AlertPolicyService', 'NotificationChannelService']:
    s.replace(
        f'**/Gapic/{client}GapicClient.php',
        r'Copyright \d{4}',
        'Copyright 2018')
    s.replace(
        f'**/V3/{client}Client.php',
        r'Copyright \d{4}',
        'Copyright 2018')

s.replace(
    'tests/**/V3/*Test.php',
    r'Copyright \d{4}',
    'Copyright 2018')

# Fix class references in gapic samples
for version in ['V3']:
    pathExpr = 'src/' + version + '/Gapic/*GapicClient.php'

    types = {
        '= new Alert': r'= new Google\\Cloud\\Monitoring\\'+ version + r'\\Alert',
        '= new Group': r'= new Google\\Cloud\\Monitoring\\'+ version + r'\\Group',
        '= new Metric': r'= new Google\\Cloud\\Monitoring\\'+ version + r'\\Metric',
        '= new TimeInterval': r'= new Google\\Cloud\\Monitoring\\'+ version + r'\\TimeInterval',
        '= TimeSeriesView::': r'= Google\\Cloud\\Monitoring\\'+ version + r'\\ListTimeSeriesRequest\\TimeSeriesView::',
        '= new Notification': r'= new Google\\Cloud\\Monitoring\\'+ version + r'\\Notification',
        '= new UptimeCheck': r'= new Google\\Cloud\\Monitoring\\'+ version + r'\\UptimeCheck',

    }

    for search, replace in types.items():
        s.replace(
            pathExpr,
            search,
            replace
)

### [START] protoc backwards compatibility fixes

# roll back to private properties.
s.replace(
    "src/**/V*/**/*.php",
    r"Generated from protobuf field ([^\n]{0,})\n\s{5}\*/\n\s{4}protected \$",
    r"""Generated from protobuf field \1
     */
    private $""")

# prevent proto messages from being marked final
s.replace(
    "src/**/V*/**/*.php",
    r"final class",
    r"class")

# Replace "Unwrapped" with "Value" for method names.
s.replace(
    "src/**/V*/**/*.php",
    r"public function ([s|g]\w{3,})Unwrapped",
    r"public function \1Value"
)

### [END] protoc backwards compatibility fixes

# fix relative cloud.google.com links
s.replace(
    "src/**/V*/**/*.php",
    r"(.{0,})\]\((/.{0,})\)",
    r"\1](https://cloud.google.com\2)"
)
