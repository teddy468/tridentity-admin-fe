import { Empty } from "antd";

export function handleDisplayNodata(isSatify: boolean) {
  if (isSatify) {
    return (
      <>
        <Empty description="Please Type Something To Search" />
      </>
    );
  } else {
    return <Empty />;
  }
}
