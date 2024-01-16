module.exports = (sequelize, DataTypes) => {
    const Checkout = sequelize.define(
        "checkout",
        {
            checkoutID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            productID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'product.model',
                    key: 'productID',
                },
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "null",
                references: {
                    model: 'product.model',
                    key: 'stock',
                },
            },
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user.model.js',
                    key: 'userID',
                },
            },
        },
        {
            timestamps: false,
            tableName: "checkout",
        }
    );

    // Associations
    Checkout.associate = (models) => {
        Checkout.belongsTo(models.Product, {
            foreignKey: 'productID',
            onDelete: 'CASCADE',
        });
        Checkout.belongsTo(models.User, {
            foreignKey: 'userID',
            onDelete: 'CASCADE',
        });
    };

    return Checkout;
};