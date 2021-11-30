import { useState } from "react";
import axios from "axios";

export function AddToDoItem(): JSX.Element {
  const [myDescription, setMyDescription] = useState<string>("");
  const [myDueDate, setMyDueDate] = useState<string>("");

  const handleAddItem = (description: string, dueDate: string) => {
    if (description === "" && dueDate === "") {
      alert("Please enter what you want to do and a due date (optional)");
    } else if (description === "") {
      alert("Please enter what you want to do.");
    } else {
      axios.post("/todos", {
        description: description,
        dueDate: dueDate,
      });
    }
  };

  return (
    <>
      <p>Add a to-do item:</p>
      <form>
        <input
          type="text"
          value={myDescription}
          placeholder="What do you have to do?"
          onChange={(e) => setMyDescription(e.target.value)}
        />
        <input
          type="date"
          value={myDueDate}
          onChange={(e) => setMyDueDate(e.target.value)}
        />
        <button
          type="submit"
          onClick={() => handleAddItem(myDescription, myDueDate)}
        >
          Add
        </button>
      </form>
    </>
  );
}
