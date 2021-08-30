export function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const validateNumber = (number) => {
  const re = /^[0-9]*$/;
  return re.test(number);
};

export const parseDate = (date, format) => {
  const day = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`;
  const month = date.getMonth() > 10 ? date.getMonth() : `0${date.getMonth()}`;
  const year = date.getFullYear();
  const hour = date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`;
  const min =
    date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  const sec =
    date.getSeconds() > 10 ? date.getSeconds() : `0${date.getSeconds()}`;

  if (format === "complete")
    return `${day}_${month}_${year}_${hour}_${min}_${sec}`;
  if (format === "dmy") return `${day}/${month}/${year}`;
  return `${day}_${month}_${year}`;
};
