import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CustomerReviews from "./components/CustomerReviews";
import Footer from "./components/Footer";
import Products from "./components/Products";

const App = () => (
  <div className="flex flex-col min-h-screen">
    <header>
      <Nav />
    </header>
    <main className="flex-grow">
      <section id="home" className="bg-black xl-padding-1 wide:padding-r">
        <Hero />
      </section>
      <section id="customer-reviews" className="p-6">
        <CustomerReviews />
      </section>
      <section id="products" className="p-6">
        <Products />
      </section>
    </main>
    <footer className="mt-auto">
      <Footer />
    </footer>
  </div>
);

export default App;
