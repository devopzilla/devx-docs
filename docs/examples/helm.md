---
slug: helm
sidebar_position: 4
---

# Helm

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
			traits.#Helm
			url:       "guku.io"
			chart:     "guku"
			version:   "v1"
			namespace: "somethingelse"
			values: {
				bla: 123
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
	"guku.io/devx/v1/transformers/argocd"
	"guku.io/devx/v1/transformers/terraform"
)

builders: v1.#StackBuilder & {
	dev: {
		mainflows: [
			v1.#Flow & {
				pipeline: [
					argocd.#AddHelmRelease & {namespace: string | *"default"},
				]
			},
		]
	}
	prod: {
		mainflows: [
			v1.#Flow & {
				pipeline: [
					terraform.#AddHelmRelease & {namespace: "somethingelse"},
				]
			},
		]
	}
}
```

  </TabItem>
</Tabs>