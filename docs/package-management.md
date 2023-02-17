---
sidebar_position: 60
---

# 🏗️ Package management

You can publish and share CUE packages directly through git repositories. Define your platform once and share it a-cross all your services
## Create a new package
Create a new repository to store your packages (you can host multiple packages in a repository).

```bash
cue.mod
└── module.cue # module: "domain.com/platform"
subpackage
└── file.cue
file.cue
```

```cue title="cue.mod/module.cue"
module: "domain.com/platform"
```

```cue title="file.cue"
package platform

rootValue: 123
```

```cue title="subpackage/file.cue"
package subpackage

subpkgValue: 123
```

## Use your new package
### Add the package to `module.cue`
```cue
module: ""

packages: [
  "github.com/<org name>/<repo name>@<git revision>:",
]		
```

### (Optional) For private repositories

Add Git secrets to the environment
```bash
export GIT_USERNAME="username"
export GIT_PASSWORD="password"
```
<!-- or
```bash
export GIT_PRIVATE_KEY_FILE="path/to/key"
export GIT_PRIVATE_KEY_FILE_PASSWORD="password"
``` -->

### Update packages
```bash
➜ devx project update
```

### Import
```cue
import (
    "domain.com/platform"
    "domain.com/platform/subpackage"
)

rootValue: platform.rootValue
subpkgValue: subpackage.subpkgValue
```