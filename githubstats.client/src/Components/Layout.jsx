import Footer from "./Footer";
import Header from "./Header";
import Content from "./Content";

const Layout = () => {
  return (
    <div className="app-container">
      <div className="header">
        <Header />
      </div>
      <div className="content">
        <Content />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
