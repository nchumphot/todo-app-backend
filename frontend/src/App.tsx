import { ToDoList } from "./components/ToDoList";
import { PageHeader } from "./components/PageHeader";
import { AddToDoItem } from "./components/AddToDoItem";

function App(): JSX.Element {
  return (
    <>
      <PageHeader />
      <AddToDoItem />
      <ToDoList />
    </>
  );
}

export default App;
