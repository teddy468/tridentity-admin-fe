import "./styles.scss";
import MenuConfig from "./menu-config/menu-config";
import FeaturedRestaurant from "./featured-restaurant/featured-restaurant";
import TopSellingDishes from "./top-selling-dishes/top-selling-dishes";
import TridentityPageHeader from "src/components/02.page-header";
const DashBoardConfig: React.FC = () => {
  return (
    <div>
      <TridentityPageHeader
        title="Dashboard config"
        style={{ marginBottom: "30px" }}
      />
      <div className="wrapper">
        <MenuConfig />
        <FeaturedRestaurant />
        <TopSellingDishes />
      </div>
    </div>
  );
};

export default DashBoardConfig;
