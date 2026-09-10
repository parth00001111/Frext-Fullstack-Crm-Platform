const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  naming: "server.mjs",
  target: "node",
  packages: "external",
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
});
if (!result.success) {
  console.error(result.logs);
  process.exit(1);
}
console.log("Built backend production server.");
