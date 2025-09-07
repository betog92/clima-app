describe("Test básico", () => {
  it("debería funcionar correctamente", () => {
    expect(1 + 1).toBe(2);
  });

  it("debería sumar números", () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(2, 3)).toBe(5);
  });
});
