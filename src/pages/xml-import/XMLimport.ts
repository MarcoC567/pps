import { isXML } from "../../services/validation.service";

export default {
  data: () => ({
    disabled: true,
    file: null,
    content: null,
    jsonData: null,
    inputRule: [(value: File) => isXML(value)],
  }),
};
