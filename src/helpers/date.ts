import moment from "moment";

export const formatDateTime = (dateString: string): string => {
  const date: Date = new Date(dateString);
  return moment(date).format("DD-MM-YYYY, HH:mm");
};

export const formatDate = (dateString: string): string => {
  const date: Date = new Date(dateString);
  return moment(date).format("DD-MM-YYYY");
};

export const formatYearComeFirst = (dateString: string): string => {
  const date: Date = new Date(dateString);
  return moment(date).format("YYYY-MM-DD");
};
