import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

import * as schema from '@/core/db/schema';

/**
 * `enableChangeListener` açık — Drizzle'ın `useLiveQuery` hook'u
 * bununla çalışıyor. Tesbih sayacı ve vakit geri sayımı gibi ekranlar
 * veriyi elle tazelemek yerine canlı sorguyla dinliyor.
 */
const sqlite = SQLite.openDatabaseSync('imanlio.db', {
  enableChangeListener: true,
});

export const db = drizzle(sqlite, { schema });

export type Database = typeof db;
