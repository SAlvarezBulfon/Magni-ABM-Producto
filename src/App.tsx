import { Provider } from "react-redux"
import { store } from "./redux/store/store"
import Rutas from "./routes/Routes"

function App() {


  return (
    <>
    <Provider store={store}>
        <Rutas/>
    </Provider>
    </>
  )
}

export default App
