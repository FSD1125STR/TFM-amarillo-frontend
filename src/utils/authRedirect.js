export const getDefaultRouteByRole = (role) => {
  if (role === "admin") return "/admin";
  if (role === "hostelero") return "/host/dashboard";
  return "/";
};

