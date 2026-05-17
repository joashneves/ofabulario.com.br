
exports.up = (pgm) => {
    pgm.addColumn("users", {
        features: {
            types: "varchar[]",
            notNull: true,
            default: "{}"
        }
    })
};

exports.down = false
