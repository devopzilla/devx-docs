---
sidebar_position: 45
---

# 🔍 Structural diff

You can build and compare stacks a-cross git history.

## Deep structural diff

```bash
devx diff HEAD~2 prod
📍 Processing target stack @ HEAD~2
📦 Downloading github.com/devopzilla/guku-devx-catalog@main/pkg @ 05bda12c0d5e05589d3efe314ea1d4817ab7252a
🏗️  Loading stack...
👀 Validating stack...
🏭 Transforming stack 100% |███████████████████████████████████████████| (3/3, 153 it/s)        
                                                                                                                                             
📍 Processing current stack
🏗️  Loading stack...
👀 Validating stack...
🏭 Transforming stack 100% |███████████████████████████████████████████| (3/3, 122 it/s)        
                                                                                                                                             
🔬 Diff
        ~ echo.$resources."echo-deployment".spec.template.spec.containers[0].resources.requests.cpu: "128m" -> "256m"
        ~ echo.containers.default.resources.requests.cpu: "128m" -> "256m"
```