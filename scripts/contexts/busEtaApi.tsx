import { createContext, useContext } from "react";
import { BusEtaApi } from "../apis/busEta";

export const BusEtaApiContext = createContext<BusEtaApi<"initialized"> | null>(
  null
);
export function useBusEtaApi() {
  const context = useContext(BusEtaApiContext);
  if (!context) {
    throw new Error("useBusEtaApi must be used within a BusEtaApiProvider");
  }
  return context;
}

export function BusEtaApiProvider({
  children,
  api,
}: {
  children: React.ReactNode;
  api: BusEtaApi<"initialized">;
}) {
  return (
    <BusEtaApiContext.Provider value={api}>
      {children}
    </BusEtaApiContext.Provider>
  );
}
