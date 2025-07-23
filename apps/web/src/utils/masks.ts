export const masks = {
  money: (value: string) => {
    if (!value || typeof value !== "string") {
      return "";
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

  removeMask: (value: string) => {
    let cleanValue = value.replace(/[^\d,]/g, "");
    cleanValue = cleanValue.replace(",", ".");
    return cleanValue;
  },
};
