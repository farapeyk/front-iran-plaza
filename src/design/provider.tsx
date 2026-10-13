"use client";

import { DirectionProvider } from "@base-ui/react/direction-provider";
import { createContext, useContext, type ReactNode } from "react";
import type { CurrentUser } from "@/types/auth";
import type { BusinessControllerGetMine200Item } from '@/design/api/generated/models/businessControllerGetMine200Item';
const AccountContext = createContext<CurrentUser | null>(null);
const BusinessContext = createContext<BusinessControllerGetMine200Item | null>(null);
export const useDesignUser = () => useContext(AccountContext);
export const useDesignBusiness = () => useContext(BusinessContext);
export function DesignProvider({ children, user = null, business = null }: { children: ReactNode; user?: CurrentUser | null; business?: BusinessControllerGetMine200Item | null }) {
  return <AccountContext.Provider value={user}><BusinessContext.Provider value={business}><DirectionProvider direction="rtl"><div className="plaza-design">{children}</div></DirectionProvider></BusinessContext.Provider></AccountContext.Provider>;
}
