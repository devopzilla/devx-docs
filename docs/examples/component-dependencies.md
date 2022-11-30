---
slug: component-dependencies
sidebar_position: 3
---

# Component dependencies

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

stack: v1.#Stack & {
	components: {
		cowsay: {
			v1.#Component
			traits.#Workload
			containers: default: {
				image: "docker/whalesay"
				command: ["cowsay"]
				args: ["Hello DevX!"]
                env: {
                    DB_URL: db.host
                }
			}
		}
		db: {
			v1.#Component
			traits.#Postgres
			version:    "9.6"
			database:   "postgres"
			persistent: true
		}
	}
}
```

  </TabItem>
  <TabItem value="builder.cue" label="builder.cue">

```cue
package main

import (
	"guku.io/devx/v1"
	"guku.io/devx/v1/transformers/compose"
)

builders: v1.#StackBuilder & {
	dev: {
		mainflows: [
			v1.#Flow & {
				pipeline: [compose.#AddComposeService]
			},
			v1.#Flow & {
				pipeline: [compose.#AddComposeVolume]
			},
			v1.#Flow & {
				pipeline: [compose.#AddComposePostgres]
			},
		]
	}
}
```

  </TabItem>
</Tabs>