module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "user",
        {
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            // Add other user attributes as needed
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(60),
                allowNull: false,
                comment: "null",
            },
            last_name: {
                type: DataTypes.STRING(60),
                allowNull: false,
                comment: "null",
            },
            user_birthday: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "null",
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "null",
            },
            phone_number: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: "null",
            },
            email: {
                type: DataTypes.STRING(60),
                allowNull: false,
                comment: "null",
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: "null",
            },
            // Add more attributes if needed
        },
        {
            timestamps: false,
            tableName: "user",
        }
    );

    // Define associations if needed
    User.associate = (models) => {
        User.hasMany(models.Checkout, {
            foreignKey: 'userID',
            onDelete: 'CASCADE',
        });
    };

    return User;
};