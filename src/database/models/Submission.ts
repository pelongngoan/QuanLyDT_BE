import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../db";

import { Assignment } from "./Assignment";
import { Student } from "./Student";

export class Submission extends Model {
  public id!: number;
  public assignmentId!: number;
  public studentId!: number;
  public fileUrl!: string;
  public submittedAt!: Date;
  public grade?: number;
  public gradedAt?: Date;
}

// Khởi tạo mô hình
Submission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Assignment,
        key: "id",
      },
      onDelete: "CASCADE", // Xóa bài tập sẽ xóa tất cả các bài nộp liên quan
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Student,
        key: "id",
      },
      onDelete: "CASCADE", // Xóa người dùng sẽ xóa tất cả các bài nộp liên quan
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: true, // Không bắt buộc (giáo viên sẽ thêm sau khi chấm)
      validate: {
        min: 0,
        max: 100,
      },
    },
    gradedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "submissions",
    timestamps: false,
  }
);

Submission.belongsTo(Assignment, { foreignKey: "assignmentId" });
Submission.belongsTo(Student, { foreignKey: "studentId" });
