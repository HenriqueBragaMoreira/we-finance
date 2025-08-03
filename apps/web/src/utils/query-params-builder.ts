type QueryParamsBuilderProps = {
  param: string;
  value?: string | number | null | undefined;
};

export function queryParamsBuilder(data: QueryParamsBuilderProps[]) {
  if (!data?.length) {
    return { params: "" };
  }

  const params = data
    .filter(
      (item) =>
        item.value !== undefined && item.value !== null && item.value !== ""
    )
    .map((item) => {
      const encodedValue =
        typeof item.value === "string"
          ? encodeURIComponent(item.value.trim())
          : String(item.value);

      return `${item.param}=${encodedValue}`;
    })
    .join("&");

  return { params };
}
