---
slug: different-envs
sidebar_position: 4
---

# Environment deltas

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
	env1: components: cowsay: containers: default: args: ["Hello DEV!"]
	env2: components: cowsay: containers: default: args: ["Hello PROD!"]
}
```

  </TabItem>
  <TabItem value="builder.cue" label="builder.cue">

```cue
package main

import (
	"guku.io/devx/v2alpha1"
	"guku.io/devx/v2alpha1/environments"
)

builders: v2alpha1.#Environments & {
	env1: environments.#Compose & {
		drivers: compose: output: file: "docker-compose-env1.yml"
	}
	env2: environments.#Compose & {
		drivers: compose: output: file: "docker-compose-env2.yml"
	}
}
```

  </TabItem>
</Tabs>

## Result

<Tabs>
  <TabItem value="Dev" label="Dev" default>

```yaml title="docker-compose-env1.yml"
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

```yaml title="docker-compose-env2.yml"
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