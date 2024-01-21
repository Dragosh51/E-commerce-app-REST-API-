module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "cart",
        {
            cartID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            productID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userID: {
                type: DataTypes.INTEGER,
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