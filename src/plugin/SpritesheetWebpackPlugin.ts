import webpack, {
    Compilation,
    type Compiler,
    type WebpackPluginInstance
} from "webpack";
import spritesheet from './libs/@pencil.js/spritesheet';
import { Minimatch } from 'minimatch';

import * as path from 'path';

import readDirectory from './utils/readDirectory';

import type { IPluginConfiguration, Pattern } from './config/IPluginConfiguration';

class SpritesheetWebpackPlugin implements WebpackPluginInstance {
    static readonly PLUGIN_NAME = `spritesheet-webpack-plugin`;
    config: Required<IPluginConfiguration>;

    constructor (configuration: IPluginConfiguration) {
        const config: Required<IPluginConfiguration> = {
            patterns: configuration.patterns,
            compilerOptions: {
                format: configuration.compilerOptions?.format ?? `png`,
                margin: configuration.compilerOptions?.margin ?? 1,
                crop: configuration.compilerOptions?.crop ?? true
            }
        };

        this.config = config;
    }

    /**
     * Build a spritesheet.
     * @param patternConfig The pattern configuration to use.
     */
    private readonly buildSpritesheet = async (patternConfig: Pattern): Promise<{ pattern: Required<Pattern>, json: string, atlas: Buffer }> => {
        const pattern = {
            rootDir: patternConfig.rootDir,
            outDir: patternConfig.outDir,

            glob: patternConfig.glob ?? `**/*.{png,gif,jpg,bmp,tiff,svg}`,
            filename: patternConfig.filename ?? `spritesheet.png`
        };

        const imagesMatcher = new Minimatch(pattern.glob);

        const files = readDirectory(pattern.rootDir).filter(x => imagesMatcher.match(x));
        const options = Object.assign({ outputName: pattern.filename }, this.config.compilerOptions);

        const { json, image } = await spritesheet(files, options);
        return {
            pattern,
            json: JSON.stringify(json),
            atlas: image
        };
    };

    /**
     * Pre-sequence hook.
     * @param compiler Webpack's internal compiler.
     */
    private readonly beforeRun = async (compiler: Compiler): Promise<void> => {
        if (this.config === undefined) throw new Error(`No asset configuration was found. Aborting atlas creation.`);
    };

    /**
     * Sequence hook.
     * @param compilation Webpack compilation.
     */
    private readonly emitHook = async (compilation: Compilation): Promise<void> => {
        const logger = compilation.getLogger(SpritesheetWebpackPlugin.PLUGIN_NAME);

        for (const pattern of this.config.patterns) {
            try {
                const spritesheet = await this.buildSpritesheet(pattern);
                const filename = spritesheet.pattern.filename.replace(`.png`, ``).replace(`.jpeg`, ``);

                compilation.emitAsset(path.join(spritesheet.pattern.outDir, spritesheet.pattern.filename), new webpack.sources.RawSource(spritesheet.atlas));
                compilation.emitAsset(path.join(spritesheet.pattern.outDir, `${filename}.json`), new webpack.sources.RawSource(spritesheet.json));
            } catch (e) {
                logger.error(`Failed to build atlas ${pattern.filename ?? `spritesheet.png`}`);
            }

            logger.debug(`Built atlas ${pattern.filename ?? `spritesheet.png`}`);
        }
    };

    /**
     * Initialize plugin and run build steps.
     * @param compiler Webpack's internal compiler.
     */
    apply = (compiler: Compiler): void => {
        compiler.hooks.beforeRun.tapPromise(SpritesheetWebpackPlugin.PLUGIN_NAME, this.beforeRun);
        compiler.hooks.shouldEmit.tap(SpritesheetWebpackPlugin.PLUGIN_NAME, () => true);

        compiler.hooks.thisCompilation.tap(SpritesheetWebpackPlugin.PLUGIN_NAME, (compilation: Compilation) => {
            compilation.hooks.processAssets.tapPromise({
                name: SpritesheetWebpackPlugin.PLUGIN_NAME,
                stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED
            }, async () => { await this.emitHook(compilation); });
        });
    };
}

export {
    SpritesheetWebpackPlugin,
    type IPluginConfiguration
};
