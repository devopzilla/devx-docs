---
slug: s3bucket
sidebar_position: 8
---

# S3 Bucket

## Config

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="stack.cue" label="stack.cue" default>

```cue
package main

import (
	"guku.io/devx/v1"
	"guku.io/devx/v1/traits"
)

stack: v1.#Stack
stack: {
	$metadata: stack: "myapp"
	components: {
		bucket: {
			traits.#S3CompatibleBucket
			s3: {
				prefix:        "guku-io-"
				name:          "my-bucket-123"
				versioning:    true
				objectLocking: false
			}
		}
	}
}
```

  </TabItem>
  <TabItem value="builder.cue" label="builder.cue">

```cue
package main

import (
	"guku.io/devx/v2alpha1"
	"guku.io/devx/v2alpha1/environments"
	"guku.io/devx/v1/components"
	"guku.io/devx/v1/transformers/compose"
	tfaws "guku.io/devx/v1/transformers/terraform/aws"
)

builders: v2alpha1.#Environments & {
	dev: environments.#Compose & {
		flows: "compose/add-compose-bucket": pipeline: [compose.#AddS3Bucket]
		"components": {
			myminio: {
				components.#Minio
				minio: {
					urlScheme: "http"
					userKeys: default: {
						accessKey:    "admin"
						accessSecret: "adminadmin"
					}
					url: _
				}
			}
			bucket: s3: {
				url:          myminio.minio.url
				accessKey:    myminio.minio.userKeys.default.accessKey
				accessSecret: myminio.minio.userKeys.default.accessSecret
			}
		}
	}
	prod: flows: "terraform/add-bucket": pipeline: [tfaws.#AddS3Bucket]
}
```

  </TabItem>
</Tabs>


## Result

<Tabs>
  <TabItem value="Dev" label="Dev" default>

```yaml title="docker-compose.yml"
version: "3"
volumes:
  miniodata: null
services:
  myminio:
    image: minio/minio:RELEASE.2023-01-02T09-40-09Z.fips
    environment:
      MINIO_ACCESS_KEY: admin
      MINIO_SECRET_KEY: adminadmin
    depends_on: []
    ports:
      - "9000:9000"
      - "9001:9001"
    command:
      - server
      - /data
      - -console-address
      - :9001
    restart: always
    volumes:
      - miniodata:/data
  bucket:
    image: minio/mc
    depends_on:
      - myminio
    entrypoint: |-
      /bin/sh -c "
      /usr/bin/mc alias set myminio http://myminio:9000 admin adminadmin;
      /usr/bin/mc mb myminio/guku-io-my-bucket-123;
      /usr/bin/mc policy set public myminio/guku-io-my-bucket-123;
      exit 0;
      "
    restart: "no"
```

  </TabItem>
  <TabItem value="Prod Terraform" label="Prod Terraform">

```json title="/build/prod/terraform/generated.tf.json"
{
  "resource": {
    "aws_s3_bucket": {
      "bucket": {
        "bucket": "guku-io-my-bucket-123"
      }
    },
    "aws_s3_bucket_versioning": {
      "bucket": {
        "bucket": "${aws_s3_bucket.bucket.bucket}",
        "versioning_configuration": {
          "status": "Enabled"
        }
      }
    }
  }
}
```

  </TabItem>

</Tabs>