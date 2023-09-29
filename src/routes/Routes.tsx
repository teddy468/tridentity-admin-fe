import loadable, { DefaultComponent } from "@loadable/component";
import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { useHistory } from "react-router-dom";
import { PATHS } from "src/constants/paths";
import { hasStorageJwtToken } from "src/helpers/storage";
import CategoryDetail from "src/pages/category-detail";
import { ExchangePageLoading, MarketPageLoading } from "src/pages/loadings";
import { PrivateRoute } from "./components/PrivateRoute";

const LoadingByTemplate: React.FC = () => {
  const history = useHistory();

  if (history.location.pathname.includes(PATHS.default())) {
    return <ExchangePageLoading />;
  }
  return <MarketPageLoading />;
};

function loadableWFallback(
  loadFn: (props: {}) => Promise<DefaultComponent<{}>>
) {
  return loadable(loadFn, {
    fallback: <LoadingByTemplate />,
  });
}

const NotFound = loadableWFallback(() => import("./components/NotFound"));
const LoginPage = loadableWFallback(() => import("src/pages/login"));
const Merchant = loadableWFallback(() => import("src/pages/merchant"));
const Consumer = loadableWFallback(() => import("src/pages/consumer"));
const Store = loadableWFallback(() => import("src/pages/store"));
const StoreDetail = loadableWFallback(() => import("src/pages/store-detail"));
const AdminUpdateStoreDetail = loadableWFallback(
  () => import("src/pages/update-store-detail/update-store-detail")
);
const TriMember = loadableWFallback(() => import("src/pages/admin-member"));
const Role = loadableWFallback(() => import("src/pages/permission-management"));
const Notification = loadableWFallback(() => import("src/pages/notification"));
const CategoryAndAttribute = loadableWFallback(
  () => import("src/pages/category-and-attribute")
);
const ProductManagement = loadableWFallback(
  () => import("src/pages/productManagement")
);

const MerchantDetailPage = loadableWFallback(
  () => import("src/pages/merchant-detail")
);
const OnboardDetailPage = loadableWFallback(
  () => import("src/pages/onboard-request-detail")
);
const UpdateInformationDetailPage = loadableWFallback(
  () => import("src/pages/update-information-request-detail")
);
const DashboardConfigPage = loadableWFallback(
  () => import("src/pages/dashboard-config")
);
const ConfigMenuPage = loadableWFallback(
  () => import("src/pages/dashboard-config/select-category")
);
const ConfigFeaturedRestaurants = loadableWFallback(
  () => import("src/pages/dashboard-config/select-store")
);
const Reconciliation = loadableWFallback(
  () => import("src/pages/reconciliation/index")
);
const ReconciliationMerchantByDate = loadableWFallback(
  () => import("src/pages/reconciliation/MerchantSettlementReports")
);
const ReconciliationStoreByDate = loadableWFallback(
  () => import("src/pages/reconciliation/StoreSettlementReport")
);
const ReconciliationOrderByStoreByDate = loadableWFallback(
  () => import("src/pages/reconciliation/StoreSettlementReportDetail")
);
const ReconciliationDetail = loadableWFallback(
  () => import("src/pages/reconciliation/detail")
);
const ConfigTopSellingDishesPage = loadableWFallback(
  () => import("src/pages/dashboard-config/select-product")
);
const ParametersPage = loadableWFallback(() => import("src/pages/parameters"));
const EmailTemplatePage = loadableWFallback(
  () => import("src/pages/email-template")
);
const EmailTemplateDetailPage = loadableWFallback(
  () => import("src/pages/email-template-detail")
);
const Report = loadableWFallback(() => import("src/pages/report"));
const ReportDetail = loadableWFallback(() => import("src/pages/report-detail"));
const ReportMerchantDetail = loadableWFallback(
  () => import("src/pages/report-merchant-detail")
);
const ForgotPassword = loadableWFallback(
  () => import("src/pages/forgot-password")
);
const ForgotSuccess = loadableWFallback(
  () => import("src/pages/forgot-success")
);
const ResetPassword = loadableWFallback(
  () => import("src/pages/reset-password")
);
const LpCashOut = loadableWFallback(() => import("src/pages/lp-management"));
const MemberOnboard = loadableWFallback(
  () => import("src/pages/member-onboard")
);

const LogisticFee = loadableWFallback(() => import("src/pages/logistic-fee"));

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" render={() => <Redirect to={PATHS.merchant()} />} />
      <Route
        exact
        path={PATHS.login()}
        render={() =>
          hasStorageJwtToken() ? (
            <Redirect to={PATHS.merchant()} />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        exact
        path={PATHS.forgotPassword()}
        render={() =>
          hasStorageJwtToken() ? (
            <Redirect to={PATHS.merchant()} />
          ) : (
            <ForgotPassword />
          )
        }
      />
      <Route
        exact
        path={PATHS.forgotSuccess()}
        render={() =>
          hasStorageJwtToken() ? (
            <Redirect to={PATHS.merchant()} />
          ) : (
            <ForgotSuccess />
          )
        }
      />
      <Route
        exact
        path={PATHS.resetPassword()}
        render={() =>
          hasStorageJwtToken() ? (
            <Redirect to={PATHS.merchant()} />
          ) : (
            <ResetPassword />
          )
        }
      />
      <Route
        exact
        path={PATHS.memberOnboard()}
        render={() => <MemberOnboard />}
      />
      <PrivateRoute exact path={PATHS.merchant()} component={Merchant} />
      <PrivateRoute exact path={PATHS.consumer()} component={Consumer} />
      <PrivateRoute exact path={PATHS.store()} component={Store} />
      <PrivateRoute exact path={PATHS.storeDetail()} component={StoreDetail} />
      <PrivateRoute
        exact
        path={PATHS.storeOnboardDetail()}
        component={StoreDetail}
      />
      <PrivateRoute
        exact
        path={PATHS.storeUpdateDetail()}
        component={StoreDetail}
      />
      <PrivateRoute
        exact
        component={AdminUpdateStoreDetail}
        path={PATHS.adminEditUpdateStoreDetail()}
      />
      <PrivateRoute
        exact
        component={AdminUpdateStoreDetail}
        path={PATHS.adminEditOnboardStoreDetail()}
      />
      <PrivateRoute exact path={PATHS.member()} component={TriMember} />
      <PrivateRoute exact path={PATHS.role()} component={Role} />
      <PrivateRoute
        exact
        path={PATHS.notification()}
        component={Notification}
      />
      <PrivateRoute
        exact
        path={PATHS.merchantDetail()}
        component={MerchantDetailPage}
      />
      <PrivateRoute
        exact
        path={PATHS.onboardDetail()}
        component={OnboardDetailPage}
      />
      <PrivateRoute
        exact
        path={PATHS.updateInformationDetail()}
        component={UpdateInformationDetailPage}
      />
      <PrivateRoute
        exact
        path={PATHS.categoryAndAttribute()}
        component={CategoryAndAttribute}
      />
      <PrivateRoute
        exact
        path={PATHS.categoryDetail()}
        component={CategoryDetail}
      />
      <PrivateRoute
        exact
        path={PATHS.productManagement()}
        component={ProductManagement}
      />
      <PrivateRoute
        exact
        path={PATHS.dashboardConfig()}
        component={DashboardConfigPage}
      />
      <PrivateRoute
        exact
        path={PATHS.configMenu()}
        component={ConfigMenuPage}
      />
      <PrivateRoute
        exact
        path={PATHS.configTopSellingDishes()}
        component={ConfigTopSellingDishesPage}
      />
      <PrivateRoute
        exact
        path={PATHS.configFeaturedRestaurants()}
        component={ConfigFeaturedRestaurants}
      />
      <PrivateRoute
        exact
        path={PATHS.parameters()}
        component={ParametersPage}
      />
      <PrivateRoute
        exact
        path={PATHS.emailTemplate()}
        component={EmailTemplatePage}
      />
      <PrivateRoute
        exact
        path={PATHS.emailTemplateDetail()}
        component={EmailTemplateDetailPage}
      />
      <PrivateRoute
        exact
        path={PATHS.reconciliation()}
        component={Reconciliation}
      />
      <PrivateRoute
        exact
        path={PATHS.reconciliationDetail()}
        component={ReconciliationDetail}
      />
      <PrivateRoute
        exact
        path={PATHS.reconciliationMerchantByDate()}
        component={ReconciliationMerchantByDate}
      />
      <PrivateRoute
        exact
        path={PATHS.reconciliationStoreByDate()}
        component={ReconciliationStoreByDate}
      />
      <PrivateRoute
        exact
        path={PATHS.reconciliationOrderByDate()}
        component={ReconciliationOrderByStoreByDate}
      />
      <PrivateRoute exact path={PATHS.report()} component={Report} />
      <PrivateRoute exact path={PATHS.lpCashOut()} component={LpCashOut} />
      <PrivateRoute
        exact
        path={PATHS.reportDetail()}
        component={ReportDetail}
      />
      <PrivateRoute
        exact
        path={PATHS.reportMerchantDetail()}
        component={ReportMerchantDetail}
      />
      <PrivateRoute exact path={PATHS.logisticFee()} component={LogisticFee} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
