<div align="center">
    <h1>spritesheet-webpack-plugin</h1>
    <h3>A Webpack plugin that generates spritesheets on-the-fly.</h3>
</div>

<div align="center">
    <img src="https://img.shields.io/github/v/release/DamienVesper/spritesheet-webpack-plugin?style=for-the-badge&color=f82055&include_prereleases">
    <img src="https://img.shields.io/github/last-commit/DamienVesper/spritesheet-webpack-plugin?style=for-the-badge&color=f82055">
    <img src="https://img.shields.io/github/languages/code-size/DamienVesper/spritesheet-webpack-plugin?style=for-the-badge&color=f82055">
</div>
<hr>

Built using [@pencil.js/spritesheet](https://github.com/pencil-js/spritesheet) and [detect-edges](https://github.com/GMartigny/detect-edges).

## Usage
To use this plugin in your Webpack configuration, add this to your plugins list:
```ts
new SpritesheetWebpackPlugin({
    patterns: [{
        rootDir: "path/to/source/directory",
        outDir: "path/to/output/directory",
        filename: "atlas.png"
    }]
}),
```
