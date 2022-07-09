function dateIsValid(dateStr) {
    if (!dateStr.match( /^\d{4}-\d{2}-\d{2}$/)) {
    return false;
  }

  const date = new Date(dateStr);

  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(dateStr);
}

console.log(dateIsValid('2022-01-24')); 