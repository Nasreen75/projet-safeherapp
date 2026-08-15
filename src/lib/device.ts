export const getDeviceId = () => {
  let id = localStorage.getItem("safeher_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("safeher_device_id", id);
  }
  return id;
};
