import {
  Hero,
  PopularProducts,
  SuperQuality,
  Services,
  SpecialOffer,
  CustomerReviews,
  Footer,
} from "./sections";
import Nav from "./components/Nav";

const App = () => (
  <main className="relative">
    <Nav />
    <section id="home" className="xl-padding-1 wide:padding-r padding-b">
      <Hero />
    </section>
    <section id="products" className="padding">
      <PopularProducts />
    </section>
    <section id="about" className="padding">
      <SuperQuality />
    </section>
    <section id="services" className="padding-x py-10">
      <Services />
    </section>
    <section id="special-offer" className="padding">
      <SpecialOffer />
    </section>
    <section id="customer-reviews" className="bg-pale-blue padding">
      <CustomerReviews />
    </section>
    <section id="contact" className="bg-black padding-x padding-t pb-8">
      <Footer />
    </section>
  </main>
);

export default App;
