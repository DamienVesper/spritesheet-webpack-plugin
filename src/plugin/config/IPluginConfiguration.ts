interface Pattern {
    /**
     * Assets root directory.
     * Note: The plugin will recursively parse this folder for assets.
     * @default undefined
     */
    rootDir: string
    /**
     * Output directory
     * The location where the output file should be sent to.
     *
     * Note: The path should be defined as relative to webpack's output path.
     * For example, if you defined webpack output.path as "dist" and outDir as "assets", the final output path would be "dist/assets".
     */
    outDir: string

    /**
     * Matching expression used to identify images to insert into the atlas.
     * @default *.{png,gif,jpg,bmp,tiff,svg}
     */
    glob?: string
    /**
     * The name of the output file.
     * @default spritesheet.png
     */
    filename?: string
}

interface IPluginConfiguration {
    patterns: Pattern[]
    compilerOptions?: Partial<{
        format: `png` | `jpeg`
        margin: number
        crop: boolean
    }>
}

export type {
    Pattern,
    IPluginConfiguration
};
