---
slug: helm
sidebar_position: 2
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
	"stakpak.dev/devx/v1"
	"stakpak.dev/devx/v1/traits"
)

stack: v1.#Stack & {
	components: {
		cowsay: {
			traits.#Helm
			helm: {
				k8s: version: minor: 19
				url:       "stakpak.dev"
				chart:     "guku"
				version:   "v1"
				namespace: "somethingelse"
				values: {
					bla: 123
				}
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
	"stakpak.dev/devx/v2alpha1"
	"stakpak.dev/devx/v1/transformers/argocd"
	terraform "stakpak.dev/devx/v1/transformers/terraform/helm"
)

builders: v2alpha1.#Environments & {
	dev: flows: "kubernetes/add-argoapp": pipeline: [
		argocd.#AddHelmRelease & {
            helm: namespace: string | *"default"
        },
	]
	prod: flows: "terraform/add-helm-release": pipeline: [
		terraform.#AddHelmRelease & {
            helm: namespace: "somethingelse"
        },
	]
}
```

  </TabItem>
</Tabs>


## Build

```bash
devx build dev
devx build prod
```

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
    repoURL: stakpak.dev
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
        "repository": "stakpak.dev",
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