---
sidebar_position: 10
---

# 📦 Standard library

Traits and transformers you can use out of the box.

## Drivers

+ Kubernetes
+ Docker Compose
+ Terraform
+ GitLab

## Transformers
|Name|Import path|
|-|-|
| ArgoCD    | `guku.io/devx/v1/transformers/argocd` |
| Docker Compose | `guku.io/devx/v1/transformers/compose` |
| GitLab | `guku.io/devx/v1/transformers/gitlab` |
| Terraform | `guku.io/devx/v1/transformers/terraform` |
| Istio | `guku.io/devx/v1/transformers/istio` |
| Kubernetes | `guku.io/devx/v1/transformers/kubernetes` |

## Traits 
`guku.io/devx/v1/traits`

### traits.#Workload        
a component that runs containers 
### traits.#Replicable      
a component that can be horizontally scaled 
### traits.#Exposable       
a component that has endpoints that can be exposed 
### traits.#Volume  
a component that has a volume 
### traits.#Postgres        
a postgres database 
### traits.#Helm    
a helm chart using helm repo 
### traits.#HelmGit 
a helm chart using git 
### traits.#HelmOCI 
a helm chart using oci 
### traits.#Workflow        
an automation workflow 