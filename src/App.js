import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer, Header } from "./components";
import Contact from "./pages/Contact";
import ContactSuccess from "./pages/ContactSuccess";
 
function App() {
  return (
    <div className="min-h-screen bg-[#E4E9Ef] flex flex-col justify-between">
      <Header />
      <div className="justify-self-start flex-1	">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route exact path="/" element={<Contact />} />
            <Route exact path="/contactsuccess" element={<ContactSuccess />} />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
