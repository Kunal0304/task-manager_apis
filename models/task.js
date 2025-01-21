module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        priority: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Medium',
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Todo',
        },
        assignedUsers: {
            type: DataTypes.JSONB, 
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        adminId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    }, {
        tableName: 'tasks', 
        timestamps: true,
    });

    return Task;
};
