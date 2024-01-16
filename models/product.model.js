module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define(
        "product",
        {
            productID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            productName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING(60),
                allowNull: false,
                comment: "null",
            },
            price: {
                type: DataTypes.FLOAT(7),
                allowNull: false,
                primaryKey: true,
                comment: "null",
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                comment: "null",
            },
        },
        {
            timestamps: false,
            tableName: "product",
        }
    );

    // Define associations if needed
    Product.hasMany(models.Checkout, {
        foreignKey: 'productID',
        onDelete: 'CASCADE',
    });

    return Product;
};