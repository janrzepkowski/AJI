import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CustomerReviews from "./components/CustomerReviews";
import Footer from "./components/Footer";
import Products from "./components/Products";

const App = () => (
  <main className="relative">
    <Nav />
    <section id="home" className="bg-black xl-padding-1 wide:padding-r">
      <Hero />
    </section>
    <section id="customer-reviews" className="p-6">
      <CustomerReviews />
    </section>
    <section id="products" className="p-6">
      <Products />
    </section>
    <section id="contact" className="padding-x padding-t pb-8">
      <Footer />
    </section>
  </main>
);

export default App;
