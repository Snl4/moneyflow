"use client";

import { useEffect, useState } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";

export function useHydration() {
  const [ok, setOk] = useState(false);
  const storeHydrated = useFinanceStore((s) => s._hasHydrated);

  useEffect(() => {
    const finish = () => {
      useFinanceStore.setState({ _hasHydrated: true });
      setOk(true);
    };

    if (useFinanceStore.persist.hasHydrated()) {
      finish();
      return;
    }

    const unsub = useFinanceStore.persist.onFinishHydration(() => {
      finish();
    });

    void useFinanceStore.persist.rehydrate();

    return () => {
      unsub();
    };
  }, []);

  return ok && storeHydrated;
}
