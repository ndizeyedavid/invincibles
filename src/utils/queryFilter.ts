export const queryFilter = (query: any) => {
  const copy = { ...query };
  const sortby = query.sort;
  const field = query.fields;
  const page = parseInt(query.page);
  const limit = parseInt(query.limit);

  let fields;
  if (field) {
    fields = [...new Set(field.split(",").join(" "))];
  } else {
    fields = "";
  }

  const excrude = ["page", "sort", "limit", "fields"];
  excrude.forEach((el) => {
    delete copy[el];
  });

  const skip = (page - 1) * limit;

  return { copy, sortby, fields, skip, limit };
};
