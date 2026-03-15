const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { tableName: "users", timestamps: false },
);

const File = sequelize.define(
  "File",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    file_path: { type: DataTypes.STRING },
    uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "files", timestamps: false },
);

const Job = sequelize.define(
  "Job",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    file_id: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "jobs", timestamps: false },
);

const Result = sequelize.define(
  "Result",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    job_id: { type: DataTypes.INTEGER },
    word_count: { type: DataTypes.INTEGER },
    paragraph_count: { type: DataTypes.INTEGER },
    keywords: { type: DataTypes.JSONB },
  },
  { tableName: "results", timestamps: false },
);

module.exports = { User, File, Job, Result, sequelize };
