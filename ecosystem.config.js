module.exports = {
  apps: [
    {
      name: 'softlete-server',
      script: 'index.ts',
      instances: 'max',
      watch: '.',
    },
  ],
};
