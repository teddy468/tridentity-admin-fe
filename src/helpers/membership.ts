export const getTierMembership = (tier: string) => {
  switch (tier) {
    case "0":
      return "Standard";
    case "1":
      return "Premium";
    case "2":
      return "GOLD";
    case "3":
      return "DIAMOND";
    default:
      return;
  }
};
