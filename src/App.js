import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer, Header } from "./components";
import Contact from "./pages/Contact";
import ContactSuccess from "./pages/ContactSuccess";
import Location from "./pages/Location";
import Menu from "./pages/Menu";
import Slots from "./pages/Slots";

import "./App.css";
import SlotBook from "./pages/SlotBook";

function App() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between">
      <Header />
      <div className="justify-self-start flex-1 flex  items-stretch	">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Contact />} />
            <Route exact path="/contactsuccess" element={<ContactSuccess />} />

            <Route exact path="/schedulling/:user" element={<Location />} />
            <Route exact path="/schedulling/:user/menu" element={<Menu />} />
            <Route exact path="/schedulling/:user/slots" element={<Slots />} />
            <Route
              exact
              path="/schedulling/:user/slotbook"
              element={<SlotBook />}
            />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
