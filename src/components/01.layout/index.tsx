import { Avatar, Breadcrumb, Layout, Menu, MenuProps } from "antd";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { LogoTrifood } from "src/assets/icons";
import {
  hasStorageJwtToken,
  removeStorageJwtToken,
  removeStorageRefreshToken,
} from "src/helpers/storage";
import { fetchListUnread } from "src/store/reducers/notification";
import { DEEP_MENUS, MENUS_ITEM, MENUS_KEY } from "../../constants/sidebar";
import "./styles.scss";
import { ADMIN_PERMISSION } from "src/constants";
import { ReduxStore } from "src/types/globalStore";
import { MemberService } from "src/services/membere-service";
import { setAdminPermission } from "src/store/actions/user";

const { Header, Content, Sider } = Layout;

interface ILayoutProps {
  children?: React.ReactNode;
}

const LayoutDefault: React.FC<ILayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const listAdminPermission = useSelector(
    (state: ReduxStore) => state.user.adminPermission
  );
  const memberService = new MemberService();

  const count = useSelector((state: any) => state.notification);
  const path = location.pathname.split("/")[1];
  const { search } = location;
  const adminRole = useSelector(
    (state: ReduxStore) => state.user.adminInformation?.role_id
  );

  async function handleGetAdminPermission() {
    if (adminRole) {
      try {
        const { data } = await memberService.getRoleDetail(adminRole);
        dispatch(setAdminPermission(data.authorities));
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    handleGetAdminPermission();
  }, [adminRole]);

  useEffect(() => {
    let interval = setInterval(async () => {
      if (hasStorageJwtToken()) {
        dispatch(fetchListUnread());
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemBreadcrumb = useMemo(() => {
    const match = DEEP_MENUS.find((item) => item.key === path);
    if (path === MENUS_KEY.LP_MANAGEMENT) {
      return ["User management", "Merchants", "Merchant membership upgrade"];
    }
    if (path === MENUS_KEY.MERCHANT) {
      if (location.pathname.split("/").length === 4) {
        return ["User Management", "Merchant", "Onboard request"];
      }
    }
    if (path === MENUS_KEY.REPORT) {
      if (location.pathname.split("/").length === 3) {
        return ["Report", "Merchant", "Order report"];
      }
      if (location.pathname.split("/").length === 4) {
        return ["Report", "Merchant"];
      }
      return ["Report"];
    }
    if (path === MENUS_KEY.CATEGORY_AND_ATTRIBUTE) {
      if (location.pathname.split("/").length === 4) {
        return ["Category & Attribute", "Sub Category"];
      }
    }
    if (match) {
      // level1
      return [match.name];
    } else {
      const isChild = DEEP_MENUS.find((item) => {
        return item.children.find((sub) => sub.key === path);
      });
      const child = isChild?.children.find((sub) => sub.key === path);
      if (isChild) {
        return [isChild.name, child?.label];
      } else {
        return ["Not found"];
      }
    }
  }, [path, location.pathname]);

  const goToThePage = (page: string) => {
    if (page.includes("/")) {
      return;
    }
    history.push(`/${page}`);
  };

  const SIDEBAR_MENUS: MenuProps["items"] = [
    {
      icon: MENUS_ITEM.USER_MANAGEMENT.icon,
      label: MENUS_ITEM.USER_MANAGEMENT.label,
      key: MENUS_ITEM.USER_MANAGEMENT.key,
      children: MENUS_ITEM.USER_MANAGEMENT.children.map((item) => {
        return {
          key: item.key,
          label: item.label,
          onClick: () => goToThePage(item.path),
        };
      }),
    },
    {
      icon: MENUS_ITEM.NOTIFICATION.icon,
      label: (
        <div className="flex between">
          <div>{MENUS_ITEM.NOTIFICATION.label}</div>
          <div>
            <Avatar
              shape="circle"
              size={20}
              style={{ backgroundColor: "#F25A5A" }}
            >
              {count}
            </Avatar>
          </div>
        </div>
      ),
      key: MENUS_ITEM.NOTIFICATION.key,
      onClick: () => goToThePage(MENUS_KEY.NOTIFICATION),
    },
    {
      icon: MENUS_ITEM.CATEGORY_AND_ATTRIBUTE.icon,
      label: MENUS_ITEM.CATEGORY_AND_ATTRIBUTE.label,
      key: MENUS_ITEM.CATEGORY_AND_ATTRIBUTE.key,
      onClick: () => goToThePage(MENUS_KEY.CATEGORY_AND_ATTRIBUTE),
    },
    {
      icon: MENUS_ITEM.PRODUCT_MANAGEMENT.icon,
      label: MENUS_ITEM.PRODUCT_MANAGEMENT.label,
      key: MENUS_ITEM.PRODUCT_MANAGEMENT.key,
      onClick: () => goToThePage(MENUS_KEY.PRODUCT_MANAGEMENT),
    },
    {
      icon: MENUS_ITEM.DASHBOARD_CONFIG.icon,
      label: MENUS_ITEM.DASHBOARD_CONFIG.label,
      key: MENUS_ITEM.DASHBOARD_CONFIG.key,
      onClick: () => goToThePage(MENUS_KEY.DASHBOARD_CONFIG),
    },
    {
      icon: MENUS_ITEM.RECONCILIATION.icon,
      label: MENUS_ITEM.RECONCILIATION.label,
      key: MENUS_ITEM.RECONCILIATION.key,
      onClick: () => goToThePage(MENUS_KEY.RECONCILIATION),
    },
    {
      icon: MENUS_ITEM.PARAMETERS.icon,
      label: MENUS_ITEM.PARAMETERS.label,
      key: MENUS_ITEM.PARAMETERS.key,
      onClick: () => goToThePage(MENUS_KEY.PARAMETERS),
    },
    {
      icon: MENUS_ITEM.EMAIL_TEMPLATE.icon,
      label: MENUS_ITEM.EMAIL_TEMPLATE.label,
      key: MENUS_ITEM.EMAIL_TEMPLATE.key,
      onClick: () => goToThePage(MENUS_KEY.EMAIL_TEMPLATE),
    },
    {
      icon: MENUS_ITEM.REPORT.icon,
      label: MENUS_ITEM.REPORT.label,
      key: MENUS_ITEM.REPORT.key,
      onClick: () => goToThePage(MENUS_KEY.REPORT),
    },
    {
      icon: MENUS_ITEM.LP_MANAGEMENT.icon,
      label: MENUS_ITEM.LP_MANAGEMENT.label,
      key: MENUS_ITEM.LP_MANAGEMENT.key,
      onClick: () => goToThePage(MENUS_KEY.LP_MANAGEMENT),
    },
    {
      icon: MENUS_ITEM.TRI_MEMBER.icon,
      label: MENUS_ITEM.TRI_MEMBER.label,
      key: MENUS_ITEM.TRI_MEMBER.key,
      children: MENUS_ITEM.TRI_MEMBER.children.map((item) => {
        return {
          key: item.key,
          label: item.label,
          onClick: () => goToThePage(item.path),
        };
      }),
    },
    {
      icon: MENUS_ITEM.LOGISTIC_FEE.icon,
      label: MENUS_ITEM.LOGISTIC_FEE.label,
      key: MENUS_ITEM.LOGISTIC_FEE.key,
      onClick: () => goToThePage(MENUS_KEY.LOGISTICFEE),
    },
    {
      icon: MENUS_ITEM.LOGOUT.icon,
      label: MENUS_ITEM.LOGOUT.label,
      key: MENUS_ITEM.LOGOUT.key,
      onClick: () => {
        removeStorageJwtToken();
        removeStorageRefreshToken();
        history.push("/login");
      },
    },
  ];

  const getSideBarMenu = useMemo(() => {
    if (!listAdminPermission) return SIDEBAR_MENUS;

    const listNoPermission = Object.keys(listAdminPermission).filter((item) => {
      return (
        listAdminPermission[item as keyof typeof listAdminPermission] ===
        ADMIN_PERMISSION.NoPermission
      );
    });

    const newSideBarMenu = SIDEBAR_MENUS.filter((item) => {
      const key = item!.key?.toString() || " ";
      return !listNoPermission.includes(key);
    });

    return newSideBarMenu;
  }, [listAdminPermission]);

  const handleClick = (item: string) => {
    if (path === "report") {
      if (item === "Report") {
        history.push(`/report`);
      }
      if (
        location.pathname.split("/").length === 3 &&
        search &&
        item === "Merchant"
      ) {
        const urlParams = new URLSearchParams(window.location.search);
        const merchant_id = urlParams.get("merchant_id");
        history.push(`/report/merchant/${merchant_id}`);
      }
    }
  };

  return (
    <>
      {hasStorageJwtToken() ? (
        <div id="layout">
          <Layout>
            <Header className="header">
              <div className="logo">
                <img src={LogoTrifood} alt="login-background" />
              </div>
              <div className="other"></div>
            </Header>
            <Layout>
              <Sider width={200} className="site-layout-background">
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[MENUS_KEY.DASHBOARD]}
                  defaultOpenKeys={[]}
                  style={{ height: "100%", borderRight: 0 }}
                  // items={SIDEBAR_MENUS}
                  items={getSideBarMenu}
                  selectedKeys={[path]}
                />
              </Sider>
              <Layout style={{ padding: "0 24px 24px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                  <Breadcrumb.Item
                    className="breadcrumb"
                    onClick={() => history.push("/")}
                  >
                    Home
                  </Breadcrumb.Item>
                  {itemBreadcrumb.map((item) => (
                    <Breadcrumb.Item
                      className="breadcrumb"
                      key={item}
                      onClick={() => handleClick(item as any)}
                    >
                      {item}
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
                <Content>{children}</Content>
              </Layout>
            </Layout>
          </Layout>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default LayoutDefault;
