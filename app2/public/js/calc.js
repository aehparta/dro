const calc = (equation, ...vars) => {
  const env = vars
    .flatMap((o) =>
      Object.entries(o).map(([key, value]) => `const ${key} = ${value};`)
    )
    .join(' ');
  equation = equation.replace(',', '.'); /* hack */
  return eval?.(`${env} with (Math) (${equation})`);
};
