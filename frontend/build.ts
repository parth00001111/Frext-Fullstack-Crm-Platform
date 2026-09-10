import tailwind from "bun-plugin-tailwind";

const result = await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: "./dist",
  target: "browser",
  minify: true,
  env: "BUN_PUBLIC_*",
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  plugins: [tailwind],
});

if (!result.success) {
  console.error(result.logs);
  process.exit(1);
}
console.log(`Built ${result.outputs.length} production assets.`);
