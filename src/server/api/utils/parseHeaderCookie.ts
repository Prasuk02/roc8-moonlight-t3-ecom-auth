const parseHeaderCookie = (cookie: string) => {
  if (!cookie) {
    return {
      token: "",
    };
  }

  const reduceInitialState = {
    token: ""
  };

  const parsedCookie = cookie
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc: { [key: string]: string }, v: string[]) => {
      const key = v[0] || "";
      const value = v[1] || "";

      if (key) {
        acc[key.trim()] = value.trim();
      }

      return acc;
    }, reduceInitialState);

  return parsedCookie;
};

export { parseHeaderCookie };
