export async function wait(time?: number) {
  return await new Promise((res) => {
    setTimeout(() => res(true), time);
  });
}
