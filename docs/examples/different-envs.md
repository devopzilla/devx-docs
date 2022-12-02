---
slug: different-envs
sidebar_position: 2
---

# Different environments

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
			}
		}
	}
}

builders: {
	dev: additionalComponents: cowsay: containers: default: args: ["Hello DEV!"]
	prod: additionalComponents: cowsay: containers: default: args: ["Hello PROD!"]
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
		]
	}
	prod: {
		mainflows: [
			v1.#Flow & {
				pipeline: [
					compose.#AddComposeService,
				]
			},
		]
	}
}
```

  </TabItem>
</Tabs>

## Result

<Tabs>
  <TabItem value="Dev" label="Dev" default>

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
      - Hello DEV!
    restart: always
    volumes: []
```

  </TabItem>
  <TabItem value="Prod" label="Prod">

```yaml title="build/prod/compose/docker-compose.yml"
version: "3"
volumes: {}
services:
  cowsay:
    image: docker/whalesay
    environment: {}
    depends_on: []
    command:
      - cowsay
      - Hello PROD!
    restart: always
    volumes: []
```

  </TabItem>
</Tabs>