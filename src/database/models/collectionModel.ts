


import { DataType,Model,Table,Column } from "sequelize-typescript";


@Table({
    tableName: "collections",
    modelName: "Collection",
    timestamps: true,
})

class Collection extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare collectionName: string;

}

export default Collection;  