/**
 * `drizzle-kit generate` tarafından üretilen migration paketi düz JS
 * olarak çıkıyor ve tip bilgisi taşımıyor. `useMigrations` hook'unun
 * beklediği şekli burada tanımlıyoruz.
 */
declare module '@drizzle/migrations' {
  const migrations: {
    journal: {
      entries: { idx: number; when: number; tag: string; breakpoints: boolean }[];
    };
    migrations: Record<string, string>;
  };
  export default migrations;
}
