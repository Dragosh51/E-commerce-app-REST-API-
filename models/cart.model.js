module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "cart",
        {
            cartID: {
                type: DataTypes.INT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            productID: {
                type: DataTypes.INT,
                allowNull: false,
            },
            userID: {
                type: DataTypes.INT,
                allowNull: false,
                comment: 'null',
            },
            price: {
                type: DataTypes.FLOAT(7),
                allowNull: false,
                comment: "null",
                references: {
                    model: 'product.model',
                    key: 'price',
                },
            },
        },
        {
            timestamps: false,
        },
        {
            tableName: "cart",
        }
    );
};