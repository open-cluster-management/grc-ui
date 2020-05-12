### HTML

Icon from [`carbon-elements`](https://github.com/IBM/carbon-elements) package is now used. Vanilla markup should be migrated to one shown in [carbondesignsystem.com](https://next.carbondesignsystem.com/components/dropdown/code) site. React and other framework variants should reflect the change automatically.

### SCSS

The selector for the invalid state has changed to avoid selecting data attributes

| Old Class                  | New Class             | Note    |
| -------------------------- | --------------------- | ------- |
| bx--dropdown[data-invalid] | bx--dropdown--invalid | Changed |
