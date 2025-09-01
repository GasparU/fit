import { Route, Routes } from 'react-router-dom'
import './App.css'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Home } from './routes/Home'


function App() {


  return (
    <DndProvider backend={HTML5Backend}>
 
    <Routes>
      {/* <h1>Proyecto Nutrición</h1> */}
      <Route path='/' element={<Home/>} />
      
    </Routes>
    </DndProvider>
  )
}

export default App
