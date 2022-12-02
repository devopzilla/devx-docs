---
slug: helm
sidebar_position: 4
---

# Helm

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


## Result

<Tabs>
  <TabItem value="Dev" label="Dev" default>

```yaml title="/build/dev/kubernetes/cowsay-application.yml"
metadata:
  name: cowsay
  namespace: somethingelse
  finalizers:
    - resources-finalizer.argocd.argoproj.io
apiVersion: argoproj.io/v1alpha1
kind: Application
spec:
  source:
    repoURL: guku.io
    targetRevision: v1
    helm:
      releaseName: cowsay
      values: |
        bla: 123
    chart: guku
  destination:
    namespace: somethingelse
  project: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true
    retry:
      limit: 5
```

  </TabItem>
  <TabItem value="Prod" label="Prod">

```json title="/build/prod/terraform/generated.tf.json"
{
  "resource": {
    "helm_release": {
      "cowsay": {
        "name": "cowsay",
        "namespace": "somethingelse",
        "repository": "guku.io",
        "chart": "guku",
        "version": "v1",
        "create_namespace": true,
        "values": [
          "bla: 123\n"
        ]
      }
    }
  }
}
```

  </TabItem>
</Tabs>