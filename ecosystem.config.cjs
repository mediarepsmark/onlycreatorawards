module.exports = {
  apps: [
    {
      name: "cpcadvertising-app",
      script: "npm",
      args: "start",
      cwd: "/home/dev_ssh/cpcadvertising",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
};
