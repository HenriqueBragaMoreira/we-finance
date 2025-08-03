export const masks = {
  money: (value: string | number) => {
    if (!value || (typeof value !== "string" && typeof value !== "number")) {
      return "";
    }

    if (typeof value === "number") {
      value = value.toString();
    }

    let cleanValue = value?.replace(/[^\d]/g, "");
    cleanValue = cleanValue?.replace(/^0+/, "");
    if (cleanValue === "") {
      return "";
    }

    const number = Number(cleanValue);

    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(number);

    return formattedValue;
  },

  listedMoney: (value: string): string => {
    if (!value || typeof value !== "string") return "";

    let cleanValue = value?.replace(/[^\d.]/g, "");

    cleanValue = cleanValue?.replace(/^0+/, "");

    if (!cleanValue) return "";

    let number: number;
    if (cleanValue?.includes(".")) {
      number = parseFloat(cleanValue);
    } else {
      number = parseInt(cleanValue, 10);
    }

    if (Number.isNaN(number)) {
      return "";
    }

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(number);
  },

  removeMask: (value: string) => {
    let cleanValue = value.replace(/[^\d,]/g, "");
    cleanValue = cleanValue.replace(",", ".");
    return cleanValue;
  },
};
