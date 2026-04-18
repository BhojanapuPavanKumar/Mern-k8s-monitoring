export const groupByMonth = (items) => {
  return items.reduce((acc, item) => {
    const date = new Date(item.date);
    const key = date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
};

export const groupByYear = (items) => {
  return items.reduce((acc, item) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = date.toLocaleDateString("en-IN", { month: "long" });

    acc[year] = acc[year] || {};
    acc[year][month] = acc[year][month] || [];
    acc[year][month].push(item);

    return acc;
  }, {});
};
