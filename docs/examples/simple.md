---
slug: simple
sidebar_position: 1
---

# Simple

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

stack: v1.#Stack & {
	components: {
		cowsay: {
			traits.#Workload
			containers: default: {
				image: "docker/whalesay"
				command: ["cowsay"]
				args: ["Hello DevX!"]
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
	"guku.io/devx/v1"
	"guku.io/devx/v1/transformers/compose"
)

builders: v1.#StackBuilder & {
	dev: {
		mainflows: [
			v1.#Flow & {
				pipeline: [
					compose.#AddComposeService,
				]
			},
			v1.#Flow & {
				pipeline: [
					compose.#ExposeComposeService,
				]
			},
		]
	}
}
```

  </TabItem>
</Tabs>


## Result

```yaml title="build/dev/compose/docker-compose.yml"
version: "3"
volumes: {}
services:
  cowsay:
    image: docker/whalesay
    environment: {}
    depends_on: []
    command:
      - cowsay
      - Hello DevX!
    restart: always
    volumes: []
```