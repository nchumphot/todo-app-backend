import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { client } from "./db";

dotenv.config();

const app = express();

client.connect().then(() => {
  console.log("Connected to Heroku database!");
  app.use(express.json());
  app.use(cors());

  // GET ALL TODOS
  app.get("/todos", async (req, res) => {
    const result = await client.query("SELECT * FROM todo;");
    res.status(200).json({
      status: "success",
      result,
    });
  });

  // GET A TODO BY ID
  app.get("/todos/:todo_id", async (req, res) => {
    const todo_id = parseInt(req.params.todo_id);
    const result = await client.query("SELECT * FROM todo WHERE id = $1;", [
      todo_id,
    ]);
    if (result.rowCount !== 0) {
      res.status(200).json({
        status: "success",
        result,
      });
    } else {
      res.status(404).json({
        status: "fail",
        data: {
          id: "Could not find a todo with that id identifier",
        },
      });
    }
  });

  // UPDATE A TODO BY ID
  app.put("/todos/:todo_id", async (req, res) => {
    const todo_id = parseInt(req.params.todo_id);
    const { description, dueDate } = req.body;
    const result = await client.query(
      "UPDATE todo SET description = $1, duedate = $2 WHERE id = $3 RETURNING *;",
      [description, dueDate, todo_id]
    );
    if (result.rowCount !== 0) {
      res.status(200).json({
        status: "success",
        result,
      });
    } else {
      res.status(404).json({
        status: "fail",
        data: {
          id: "Could not find a todo with that id identifier",
        },
      });
    }
  });

  // ADD A TODO
  app.post("/todos", async (req, res) => {
    const { description, dueDate } = req.body;
    const result = await client.query(
      "INSERT INTO todo (description, duedate) VALUES ($1, $2) RETURNING *",
      [description, dueDate]
    );
    res.status(201).json({
      status: "success",
      result,
    });
  });

  // DELETE A TODO BY ID
  app.delete("/todos/:todo_id", async (req, res) => {
    const todo_id = parseInt(req.params.todo_id);
    const deletedTodo = await client.query(
      "DELETE FROM todo WHERE id = $1 RETURNING *",
      [todo_id]
    );
    res.status(200).json({
      status: "success",
      data: {
        deletedTodo,
      },
    });
  });

  app.listen(5000, () => {
    console.log("Server listening on port 5000!");
  });
});
