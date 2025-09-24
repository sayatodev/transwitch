import { Company } from "hk-bus-eta";

export function getCompanyColor(company: Company): string {
  switch (company) {
    //"kmb" | "nlb" | "ctb" | "lrtfeeder" | "gmb" | "lightRail" | "mtr" | "sunferry" | "hkkf" | "fortuneferry"
    case "kmb":
      return "bg-[#D62828] text-white";
    case "nlb":
      return "bg-[#00B04F] text-white";
    case "ctb":
      return "bg-[#ffe83a] text-gray-800";
    case "lrtfeeder":
      return "bg-[#000000] text-black";
    case "gmb":
      return "bg-[#2E6F40] text-white";
    case "lightRail":
      return "bg-[#000000] text-white";
    case "mtr":
      return "bg-[#000000] text-white";
    case "sunferry":
      return "bg-[#000000] text-white";
    case "hkkf":
      return "bg-[#000000] text-white";
    case "fortuneferry":
      return "bg-[#000000] text-white";
  }
}
