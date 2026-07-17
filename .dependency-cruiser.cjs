module.exports = {
  forbidden: [
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'domain-is-independent',
      severity: 'error',
      from: { path: '^src/domain/' },
      to: { path: '^(app|src/(application|infrastructure|presentation|composition))/' },
    },
    {
      name: 'application-does-not-depend-on-outer-layers',
      severity: 'error',
      from: { path: '^src/application/' },
      to: { path: '^(app|src/(infrastructure|presentation|composition))/' },
    },
    {
      name: 'infrastructure-does-not-depend-on-presentation',
      severity: 'error',
      from: { path: '^src/infrastructure/' },
      to: { path: '^src/(presentation|composition)/' },
    },
    {
      name: 'presentation-does-not-depend-on-infrastructure',
      severity: 'error',
      from: { path: '^src/presentation/' },
      to: { path: '^src/infrastructure/' },
    },
    {
      name: 'routes-are-thin',
      severity: 'error',
      from: { path: '^app/' },
      to: { path: '^src/(application|domain|infrastructure)/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    reporterOptions: { dot: { collapsePattern: 'node_modules/[^/]+' } },
  },
};
