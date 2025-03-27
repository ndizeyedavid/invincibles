import { toDataURL } from "qrcode";

const generateQrCode = async (id: string) => {
  const url = process.env?.QRCODE_REDIRECT_LINK;
  return await toDataURL(`${url}?id=${id}`);
};

export default generateQrCode;
