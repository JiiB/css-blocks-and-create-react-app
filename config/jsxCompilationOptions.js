module.exports = {
    compilationOptions: {},
    optimization: {
        rewriteIdents: true,
        mergeDeclarations: true,
        removeUnusedStyles: true,
        conflictResolution: true,
        enabled: process.env.NODE_ENV === "production",
    },
    aliases: {},
}