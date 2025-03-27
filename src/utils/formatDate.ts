const formatDate = (inputDate: Date | string | null) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (inputDate === null || inputDate == undefined) return null;
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  return {
    hyphen_separated_numeric_date: `${day}-${date.getMonth() + 1}-${year}`,
    full_date_format: `${day} ${month} ${year}`,
    slash_date_format: `${day}/${date.getMonth() + 1}/${year}`,
  };
};

export default formatDate;
