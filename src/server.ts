import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { client } from "./db";
import filePath from "./filePath";

dotenv.config();

const app = express();

client.connect().then(() => {
  console.log("Connected to Heroku database!");
  app.use(express.json());
  app.use(cors());

  // HOME PAGE
  app.get("/", (req, res) => {
    const pathToFile = filePath("../public/index.html");
    console.log(pathToFile);
    res.sendFile(pathToFile);
  });

  // GET ALL TODOS
  app.get("/todos", async (req, res) => {
    const result = await client.query("SELECT * FROM todos;");
    res.status(200).json({
      status: "success",
      result,
    });
  });

  // GET A TODO BY ID
  app.get("/todos/:todo_id", async (req, res) => {
    const todo_id = parseInt(req.params.todo_id);
    const result = await client.query("SELECT * FROM todos WHERE id = $1;", [
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
    const { description, due_date } = req.body;
    const result = await client.query(
      "UPDATE todos SET description = $1, due_date = $2 WHERE id = $3 RETURNING *;",
      [description, due_date, todo_id]
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
    const { description, due_date } = req.body;
    const result = await client.query(
      "INSERT INTO todos (description, due_date) VALUES ($1, $2) RETURNING *",
      [description, due_date]
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
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [todo_id]
    );
    res.status(200).json({
      status: "success",
      data: {
        deletedTodo,
      },
    });
  });

  // use the environment variable PORT, or 4000 as a fallback
  const PORT_NUMBER = process.env.PORT ?? 4000;

  app.listen(PORT_NUMBER, () => {
    console.log(`Server listening on port ${PORT_NUMBER}!`);
  });
});
