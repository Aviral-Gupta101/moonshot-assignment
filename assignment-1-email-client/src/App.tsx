import { RecoilRoot } from "recoil"
import Navbar from "./components/Navbar"
import { HomePage } from "./pages/Homepage"

function App() {

  return (
    <>
    <RecoilRoot >
      <MainApp />
    </RecoilRoot>
    </>
  )
}

function MainApp(){
  

  return (
    
    <div className="flex flex-col min-h-screen bg-background px-8 pt-8 pb-4">

      <Navbar />
      <HomePage />
    </div>

  )
}


export default App
